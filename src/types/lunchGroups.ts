import { ChatRoom } from "./chat";
import { Organization } from "./organization";
import { Restaurant } from "./restaurant";
import { User } from "./user";

export enum LunchGroupStatus {
  open = "Open",
  closed = "Closed",
  cancelled = "Cancelled",
}

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
  chatRoom: ChatRoom;
  createdAt: string;
  updatedAt: string;
};

export type LunchGroupPoll = {
  _id: string;
  status: `${LunchGroupStatus}`;
  label: string;
  description?: string;
  owner: User;
  votes: Array<{ user: User; restaurant: Restaurant }>;
  meetingTime: string;
  voteDeadline: string;
  allowedRestaurants?: Array<Restaurant>;
  lunchGroup?: LunchGroup;
  chatRoom: ChatRoom;
  createdAt: string;
  updatedAt: string;
};
