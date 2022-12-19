import { Organization } from "~/types/organization";
import { User } from "@/types/user";

export type AuthEmailCredentials = {
  type: "email";
  email: string;
  password: string;
};

export type AuthProviderCredentials = {
  type: "google" | "facebook" | "linkedin";
  email: string;
  userId: string;
};

export type AuthLoginDto = AuthEmailCredentials | AuthProviderCredentials;

export type AuthLoginData = {
  accessToken: string;
  account: User;
  organizations: Array<Organization>;
};

export type ValidateInvitationDto = {
  invitationId: string;
  emailHash?: string;
};

export type AuthRegisterDto = {
  type: "email" | "google" | "facebook" | "linkedin";
  email: string;
  password?: string; // Uniquement si type = email
  userId?: string; // Uniquement si type = google /. facebook / linkedin
  firstName: string;
  lastName: string;
  avatar: string;
};

export type AuthLinkDto = {
  type: "email" | "google" | "facebook" | "linkedin";
  email: string;
  password?: string; // Uniquement si type = email
  userId?: string;
};

export type AcceptInvitationDto = ValidateInvitationDto & {
  account: {
    mode: "link" | "register";
    linkPayload?: AuthLinkDto;
    registerPayload?: AuthRegisterDto;
  };
};

export type InvitationPayload = {
  success: boolean;
  notFound: boolean;
  maxUsageReached: boolean;
  alreadyUsed: boolean;
  expired: boolean;
  invitation: {
    _id: string;
    type: "email" | "link";
    organization: {
      _id: string;
      name: string;
    };
  };
};

export type AcceptInvitationResponse = Omit<InvitationPayload, "invitation">;
