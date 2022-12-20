import { LunchGroup } from "./lunchGroups";
import { User } from "./user";

export enum LunchGroupEmittedEvents {
  createGroup = "CreateGroup",
  deleteGroup = "DeleteGroup",
  joinGroup = "JoinGroup",
  leaveGroup = "LeaveGroup",
  updateGroup = "UpdateGroup",
}

export enum LunchGroupReceivedEvents {
  addUserToOrganization = "AddUserToOrganization",
  userConnected = "UserConnected",
  userDisconnected = "UserDisconnected",
  setUserList = "SetUserList",
  setGroupList = "SetGroupList",
  addGroup = "AddGroup",
  removeGroup = "RemoveGroup",
  updateGroup = "UpdateGroup",
  addUserToGroup = "AddUserToGroup",
  removeUserFromGroup = "RemoveUserFromGroup",
}

export type MapUser = Omit<
  User,
  "organizations" | "credentials.password" | "credentials.userId"
> & {
  isOnline: boolean;
};

export type MapLunchGroup = {
  _id: string;
  meetingTime: string;
  userSlots?: number;
  restaurant: string;
  users: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
};

export type GatewayEventResponse<T = Record<string, any>> = {
  success: boolean;
  messsage?: string;
  data?: T;
};
