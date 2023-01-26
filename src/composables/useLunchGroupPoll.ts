import { Restaurant } from "@/types/restaurant";
import { GatewayUser } from "@/types/mapGateway";
import { MapLunchGroupPoll } from "@/types/mapGateway";
import { useTimer, useTimerPercentage } from "./useTimer";

export function useLunchGroupPoll(poll: MapLunchGroupPoll) {
  const mapGatewayApi = inject(mapApiInjectionKey);
  const userStore = useUserStore();

  const users = computed<GatewayUser[]>(
    () =>
      poll.votes
        .map(
          (vote) =>
            mapGatewayApi?.users.value.find((user) => user._id === vote.user) ??
            null
        )
        .filter((user) => user !== null) as GatewayUser[]
  );

  const voteCount = computed<number>(() => poll.votes.length);

  const voteState = computed(() => {
    const restaurantIds = [
      ...new Set([
        ...poll.votes.map((vote) => vote.restaurant),
        ...(poll?.allowedRestaurants ?? []),
      ]),
    ];

    return restaurantIds
      .map((restaurantId) => ({
        restaurant: mapGatewayApi?.restaurants.value.find(
          (restaurant) => restaurant._id === restaurantId
        ) as Restaurant,
        voteCount: {
          total: poll.votes.filter((vote) => vote.restaurant === restaurantId)
            .length,
          percentage: Math.round(
            (poll.votes.filter((vote) => vote.restaurant === restaurantId)
              .length /
              poll.votes.length) *
              100
          ),
        },

        users: poll.votes
          .filter((vote) => vote.restaurant === restaurantId)
          .map(
            (vote) =>
              mapGatewayApi?.users.value.find(
                (user) => user._id === vote.user
              ) as GatewayUser
          ),
      })) // SORT BY NAME
      .sort((a, b) => {
        if (a.restaurant.name < b.restaurant.name) return -1;
        if (a.restaurant.name > b.restaurant.name) return 1;
        return 0;
      });
  });

  const timeLeft = useTimer(poll.voteDeadline);
  const timeLeftPercentage = useTimerPercentage(
    poll.voteDeadline,
    poll.createdAt
  );

  const userVoteValue = computed<string | null>(
    () =>
      poll.votes.find((vote) => vote.user === userStore.user?._id)
        ?.restaurant ?? null
  );
  const userHasVoted = computed<boolean>(
    () => poll.votes.some((vote) => vote.user === userStore.user?._id) ?? false
  );

  const voteOptions = computed(() => {
    if (poll.allowedRestaurants)
      return poll.allowedRestaurants.map((restaurantId) => ({
        label: mapGatewayApi?.restaurants.value.find(
          (restaurant) => restaurant._id === restaurantId
        )?.name as string,
        value: restaurantId,
      }));

    return mapGatewayApi?.restaurants.value.map((restaurant) => ({
      label: restaurant.name,
      value: restaurant._id,
    })) as { label: string; value: string }[];
  });

  return {
    users,
    voteCount,
    voteState,
    voteOptions,
    timeLeft,
    timeLeftPercentage,
    userHasVoted,
    userVoteValue,
  };
}
