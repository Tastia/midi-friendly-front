import { Restaurant } from "@/types/restaurant";
export type Organization = {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  coordinates: {
    longitude: number;
    latitude: number;
  };
  restaurants: Restaurant[];
  createdAt: string;
  updatedAt: string;
};

export type OrganizationList = Array<Omit<Organization, "">>;

export type CreateOrganizationDto = Omit<Organization, "_id" | "coordinates">;
