import { LunchGroup } from "./lunchGroups";
import { User } from "./user";

export enum LunchGroupEmittedEvents {
  createGroup = "CreateGroup",
  deleteGroup = "DeleteGroup",
  joinGroup = "JoinGroup",
  leaveGroup = "LeaveGroup",
  updateGroup = "UpdateGroup",
  createGroupPoll = "CreateGroupPoll",
  deleteGroupPoll = "DeleteGroupPoll",
  voteGroupPoll = "VoteGroupPoll",
}

export enum LunchGroupReceivedEvents {
  addUserToOrganization = "AddUserToOrganization",
  userConnected = "UserConnected",
  userDisconnected = "UserDisconnected",
  setUserList = "SetUserList",
  setGroupList = "SetGroupList",
  setGroupPollList = "SetGroupPollList",
  addGroup = "AddGroup",
  removeGroup = "RemoveGroup",
  updateGroup = "UpdateGroup",
  addUserToGroup = "AddUserToGroup",
  removeUserFromGroup = "RemoveUserFromGroup",
  addGroupPoll = "AddGroupPoll",
  removeGroupPoll = "RemoveGroupPoll",
  updateGroupPoll = "UpdateGroupPoll",
  addGroupPollEntry = "AddGroupPollEntry",
  closeGroupPoll = "CloseGroupPoll",
}

export type GatewayUser = Omit<
  User,
  "organizations" | "credentials.password" | "credentials.userId"
> & {
  isOnline: boolean;
};

export type MapLunchGroup = {
  _id: string;
  label: string;
  description?: string;
  meetingTime: string;
  userSlots?: number;
  restaurant: string;
  users: string[];
  owner: string;
  chatRoom: string;
  createdAt: string;
  updatedAt: string;
};

export type MapLunchGroupPoll = {
  _id: string;
  label: string;
  description?: string;
  meetingTime: string;
  userSlots?: number;
  restaurant: string;
  votes: Array<{ user: string; restaurant: string }>;
  allowedRestaurants?: Array<string>;
  voteDeadline: string;
  owner: string;
  chatRoom: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateGroupPollDto = Omit<
  MapLunchGroupPoll,
  "_id" | "votes" | "owner" | "chatRoom" | "createdAt" | "updatedAt"
> & { userVote: string };

export type GatewayEventResponse<T = Record<string, any>> = {
  success: boolean;
  messsage?: string;
  data?: T;
};
