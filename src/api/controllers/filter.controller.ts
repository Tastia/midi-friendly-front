import { ApiInstance } from "@/api/instance";

export const FilterController = {
  getRestaurants: () =>
    ApiInstance.get<Array<{ _id: string; name: string }>>(
      "/filters/restaurants"
    ).then((res) => res.data),
};
