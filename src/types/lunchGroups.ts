import { Organization } from "./organization";
import { Restaurant } from "./restaurant";
import { User } from "./user";

export type LunchGroup = {
  _id: string;
  label: string;
  description?: string;
  restaurant: Restaurant;
  owner: User;
  users: Array<User>;
  meetingTime: string;
  userSlots?: number;
  organization: Organization;
  createdAt: string;
  updatedAt: string;
};
