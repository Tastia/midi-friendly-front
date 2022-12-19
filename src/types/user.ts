import { Organization } from "./organization";

export enum CredentialsProviders {
  email = "email",
  google = "google",
  facebook = "facebook",
  linkedin = "linkedin",
}

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  credentials: {
    type: "email" | "google" | "facebook" | "linkedin";
    email: string;
  };
  organizations: Organization[];
};
