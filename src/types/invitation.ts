import { User } from "~/types/user";
import { Organization } from "~/types/organization";

export enum InvitationType {
  email = "email",
  link = "link",
}

export enum InvitationTargetApp {
  client = "client",
  admin = "admin",
}

export type InvitationUsage = {
  _id: string;
  email?: string;
  usageDate: string;
  linkedAccount: User;
};

export type Invitation = {
  _id: string;
  type: InvitationType;
  isExpired: boolean;
  targetApp: InvitationTargetApp;
  organization: Organization;
  expireAt: string;
  maxUsage?: string;
  emails?: string[];
  usage: Array<InvitationUsage>;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvitationLinkDto = {
  organizationId: string;
  expireAt: string;
  maxUsage: number;
  targetApp: InvitationTargetApp;
};

export type CreateInvitationEmailDto = Omit<CreateInvitationLinkDto, "maxUsage"> & { emails: string[] };
