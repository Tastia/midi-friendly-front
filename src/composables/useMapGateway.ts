import { Restaurant } from "@/types/restaurant";
import { LunchGroup } from "@/types/lunchGroups";
import io from "socket.io-client";
import {
  GatewayEventResponse,
  LunchGroupEmittedEvents,
  LunchGroupReceivedEvents,
  MapLunchGroup,
  MapUser,
} from "@/types/mapGateway";
import { useMessage } from "naive-ui";

export function useMapGateway() {
  const message = useMessage();
  const userStore = useUserStore();
  const client = io(import.meta.env.VITE_GATEWAY_URL as string, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${userStore.accessToken}`,
          organizationId: userStore.activeOrganization?._id,
        },
      },
    },
  });

  const users = ref<MapUser[]>([]);
  const restaurants = ref<Restaurant[]>([]);
  const lunchGroups = ref<MapLunchGroup[]>([]);

  onMounted(
    async () =>
      (restaurants.value =
        await RestaurantController.getOrganizationRestaurants(
          userStore.activeOrganization?._id as string
        ).then((data) => data.restaurants))
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
    LunchGroupReceivedEvents.setUserList,
    ({ users: userList }: { users: MapUser[] }) => (users.value = userList)
  );

  client.on(
    LunchGroupReceivedEvents.setGroupList,
    ({ groups }: { groups: MapLunchGroup[] }) => (lunchGroups.value = groups)
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
      console.log({ group, groupId, userId });
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
      "_id" | "owner" | "users" | "createdAt" | "updatedAt"
    >
  ) {
    const { setSuccess, setError } = useActionNotification(
      "Création du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.createGroup,
      group,
      (res: GatewayEventResponse) => {
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
    const { setSuccess, setError } = useActionNotification(
      "Mise à jour du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.updateGroup,
      group,
      (res: GatewayEventResponse) => {
        if (res.success) setSuccess("Groupe mis à jour");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function DeleteGroup(groupId: string) {
    const { setSuccess, setError } = useActionNotification(
      "Suppression du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.deleteGroup,
      { groupId },
      (res: GatewayEventResponse) => {
        if (res.success) setSuccess("Groupe supprimé");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function JoinGroup(groupId: string) {
    const { setError, setSuccess } =
      useActionNotification("Ajout au groupe...");
    client.emit(
      LunchGroupEmittedEvents.joinGroup,
      { groupId },
      (res: GatewayEventResponse) => {
        if (res.success) setSuccess("Groupe rejoint");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  function LeaveGroup(groupId: string) {
    const { setSuccess, setError } = useActionNotification(
      "Sortie du groupe..."
    );
    client.emit(
      LunchGroupEmittedEvents.leaveGroup,
      { groupId },
      (res: GatewayEventResponse) => {
        if (res.success) setSuccess("Groupe quitté");
        else {
          setError("Une erreur est survenue, veuillez réessayer");
          console.error(res?.messsage ?? "Unknown error");
        }
      }
    );
  }

  onUnmounted(() => {
    client.disconnect();
  });

  return {
    users,
    lunchGroups,
    restaurants,
    CreateGroup,
    UpdateGroup,
    DeleteGroup,
    JoinGroup,
    LeaveGroup,
  };
}
