import { ComputedRef } from "vue";
import { MapUser } from "@/types/mapGateway";

export interface ParsedMapLunchGroup {
  _id: string;
  restaurant: string;
  meetingTime: string;
  userSlots?: number;
  owner: MapUser;
  users: MapUser[];
  createdAt: string;
  updatedAt: string;
}

export function useRestaurantLunchGroups(
  restaurantId: string
): ComputedRef<ParsedMapLunchGroup[]> {
  const gatewayApi = inject(mapApiInjectionKey);

  return computed(() => {
    const lunchGroups =
      gatewayApi?.lunchGroups.value.filter(
        (group) => group.restaurant === restaurantId
      ) ?? [];

    return lunchGroups.map(
      (group) =>
        ({
          ...group,
          users: group.users.map(
            (userId) =>
              gatewayApi?.users.value.find((user) => user._id === userId) ??
              userId
          ) as MapUser[],
          owner: gatewayApi?.users.value.find(
            (user) => user._id === group.owner
          ) as MapUser,
        } as ParsedMapLunchGroup)
    );
  });
}
