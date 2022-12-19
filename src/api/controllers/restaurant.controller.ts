import { Organization } from "~/types/organization";
import { ApiInstance } from "@/api/instance";
export const RestaurantController = {
  getOrganizationRestaurants: (organizationId: string) =>
    ApiInstance.get<Organization>(`/organizations/${organizationId}`).then(
      (res) => res.data
    ),
};
