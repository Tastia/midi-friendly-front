import { CreateGroupPollDto } from "./../types/mapGateway";
import { Restaurant } from "@/types/restaurant";
import { LunchGroup } from "@/types/lunchGroups";
import io from "socket.io-client";
import {
  GatewayEventResponse,
  LunchGroupEmittedEvents,
  LunchGroupReceivedEvents,
  MapLunchGroup,
  MapLunchGroupPoll,
  GatewayUser,
} from "@/types/mapGateway";

export function useMapGateway() {
  const userStore = useUserStore();
  const client = io(`${import.meta.env.VITE_GATEWAY_URL}/map` as string, {
    auth: (callback) => {
      callback({
        accessToken: userStore.accessToken,
        organizationId: userStore.activeOrganization?._id,
      });
    },
  });

  const users = ref<GatewayUser[]>([]);
  const restaurants = ref<Restaurant[]>([]);
  const lunchGroups = ref<MapLunchGroup[]>([]);
  const lunchGroupPolls = ref<MapLunchGroupPoll[]>([]);
  const pendingOperation = ref<`${LunchGroupEmittedEvents}` | null>();

  onMounted(
    async () =>
      (restaurants.value =
        await RestaurantController.getOrganizationRestaurants(
          userStore.activeOrganization?._id as string
        ).then((data) => data.restaurants))
  );

  client.on(
    LunchGroupReceivedEvents.setUserList,
    ({ users: userList }: { users: GatewayUser[] }) => (users.value = userList)
  );

  client.on(
    LunchGroupReceivedEvents.userConnected,
    ({ userId }: { userId: string }) =>
      (users.value = users.value.map((user) =>
        user._id === userId ? { ...user, isOnline: true } : user
      ))
  );

  client.on(
    LunchGroupReceivedEvents.userDisconnected,
    ({ userId }: { userId: string }) =>
      (users.value = users.value.map((user) =>
        user._id === userId ? { ...user, isOnline: false } : user
      ))
  );

  client.on(
    LunchGroupReceivedEvents.addUserToOrganization,
    ({ user }: { user: GatewayUser }) => users.value.push(user)
  );

  client.on(
    LunchGroupReceivedEvents.setGroupList,
    ({ groups }: { groups: MapLunchGroup[] }) => (lunchGroups.value = groups)
  );

  client.on(
    LunchGroupReceivedEvents.setGroupPollList,
    ({ groups }: { groups: MapLunchGroupPoll[] }) =>
      (lunchGroupPolls.value = groups)
  );

  client.on(
    LunchGroupReceivedEvents.addGroupPoll,
    ({ groupPoll }: { groupPoll: MapLunchGroupPoll }) =>
      lunchGroupPolls.value.push(groupPoll)
  );

  client.on(
    LunchGroupReceivedEvents.addGroupPollEntry,
    (data: { pollId: string; vote: { user: string; restaurant: string } }) => {
      const groupPoll = lunchGroupPolls.value.find(
        (group) => group._id === data.pollId
      );
      if (!groupPoll) return;

      if (!groupPoll.votes.some((vote) => vote.user === data.vote.user))
        groupPoll.votes.push(data.vote);
      else
        groupPoll.votes = groupPoll.votes.reduce(
          (acc: Array<{ restaurant: string; user: string }>, vote) => {
            return [
              ...acc,
              ...[vote.user === data.vote.user ? data.vote : vote],
            ];
          },
          []
        );
    }
  );

  client.on(
    LunchGroupReceivedEvents.closeGroupPoll,
    (data: { pollId: string }) =>
      lunchGroupPolls.value.filter((group) => group._id !== data.pollId)
  );

  client.on(
    LunchGroupReceivedEvents.addGroup,
    ({ group }: { group: MapLunchGroup }) => lunchGroups.value.push(group)
  );

  client.on(
    LunchGroupReceivedEvents.removeGroup,
    ({ groupId }: { groupId: string }) =>
      (lunchGroups.value = lunchGroups.value.filter(
        (group) => group._id !== groupId
      ))
  );

  client.on(
    LunchGroupReceivedEvents.updateGroup,
    ({ groupId, groupData }: { groupId: string; groupData: MapLunchGroup }) =>
      (lunchGroups.value = lunchGroups.value.map((group) =>
        group._id === groupId ? { ...group, ...groupData } : group
      ))
  );

  client.on(
    LunchGroupReceivedEvents.addUserToGroup,
    ({ groupId, userId }: { groupId: string; userId: string }) =>
      (lunchGroups.value = lunchGroups.value.map((group) =>
        group._id === groupId
          ? ({
              ...group,
              users: [...group.users, userId],
            } as MapLunchGroup)
          : group
      ))
  );

  client.on(
    LunchGroupReceivedEvents.removeUserFromGroup,
    ({ groupId, userId }: { groupId: string; userId: string }) => {
      const group = lunchGroups.value.find((group) => group._id === groupId);
      lunchGroups.value = lunchGroups.value.map((group) =>
        group._id === groupId
          ? ({
              ...group,
              users: group.users.filter((user) => user !== userId),
            } as MapLunchGroup)
          : group
      );
    }
  );

  function CreateGroup(
    group: Omit<
      MapLunchGroup,
      "_id" | "owner" | "users" | "createdAt" | "updatedAt" | "chatRoom"
    >
  ) {
    pendingOperation.value = LunchGroupEmittedEvents.createGroup;
    const { setSuccess, setError } = useActionNotification(
      "Création du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.createGroup,
      group,
      (res: GatewayEventResponse) => {
        pendingOperation.value = null;
        if (res.success) setSuccess("Groupe créé");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function UpdateGroup(group: {
    groupId: string;
    groupData: Omit<LunchGroup, "_id" | "owner" | "users" | "restaurant">;
  }) {
    pendingOperation.value = LunchGroupEmittedEvents.updateGroup;
    const { setSuccess, setError } = useActionNotification(
      "Mise à jour du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.updateGroup,
      group,
      (res: GatewayEventResponse) => {
        pendingOperation.value = null;
        if (res.success) setSuccess("Groupe mis à jour");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function DeleteGroup(groupId: string) {
    pendingOperation.value = LunchGroupEmittedEvents.deleteGroup;
    const { setSuccess, setError } = useActionNotification(
      "Suppression du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.deleteGroup,
      { groupId },
      (res: GatewayEventResponse) => {
        pendingOperation.value = null;
        if (res.success) setSuccess("Groupe supprimé");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function JoinGroup(groupId: string) {
    pendingOperation.value = LunchGroupEmittedEvents.joinGroup;
    const { setError, setSuccess } =
      useActionNotification("Ajout au groupe...");
    client.emit(
      LunchGroupEmittedEvents.joinGroup,
      { groupId },
      (res: GatewayEventResponse) => {
        pendingOperation.value = null;
        if (res.success) setSuccess("Groupe rejoint");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function LeaveGroup(groupId: string) {
    pendingOperation.value = LunchGroupEmittedEvents.leaveGroup;
    const { setSuccess, setError } = useActionNotification(
      "Sortie du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.leaveGroup,
      { groupId },
      (res: GatewayEventResponse) => {
        pendingOperation.value = null;
        if (res.success) setSuccess("Groupe quitté");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function CreateGroupPoll(groupData: CreateGroupPollDto) {
    pendingOperation.value = LunchGroupEmittedEvents.createGroupPoll;
    const { setSuccess, setError } = useActionNotification(
      "Création du groupe par vote en cours..."
    );
    client.emit(
      LunchGroupEmittedEvents.createGroupPoll,
      groupData,
      (res: GatewayEventResponse) => {
        pendingOperation.value = null;
        if (res.success) setSuccess("Groupe par vote créé");
        else {
          setError(
            res?.messsage ?? "Une erreur est survenue, veuillez réessayer"
          );
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function SaveUserPollVote(data: { pollId: string; restaurantId: string }) {
    pendingOperation.value = LunchGroupEmittedEvents.voteGroupPoll;
    const { setSuccess, setError } = useActionNotification(
      "Enregistrement de votre vote en cours..."
    );

    client.emit(
      LunchGroupEmittedEvents.voteGroupPoll,
      data,
      (response: GatewayEventResponse) => {
        pendingOperation.value = null;
        if (response.success) setSuccess("Vote enregistré");
        else {
          setError(
            response?.messsage ?? "Une erreur est survenue, veuillez réessayer"
          );
          console.error(response?.messsage ?? "Unknown error");
        }
      }
    );
  }

  // function Place

  onUnmounted(() => {
    client.disconnect();
  });

  return {
    users,
    lunchGroups,
    lunchGroupPolls,
    restaurants,
    pendingOperation,
    CreateGroup,
    UpdateGroup,
    DeleteGroup,
    JoinGroup,
    LeaveGroup,
    CreateGroupPoll,
    SaveUserPollVote,
  };
}
