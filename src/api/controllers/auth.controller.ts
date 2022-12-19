import { ApiInstance } from "@/api/instance";
import {
  AuthLoginDto,
  AuthLoginData,
  ValidateInvitationDto,
  AcceptInvitationDto,
  InvitationPayload,
  AcceptInvitationResponse,
} from "@/types/auth";

export const Authcontroller = {
  login: (authPayload: AuthLoginDto) =>
    ApiInstance.post<AuthLoginData>("/auth/login", authPayload).then(
      (res) => res.data
    ),
  validateInvitation: (invitationDto: ValidateInvitationDto) =>
    ApiInstance.post<InvitationPayload>(
      "/auth/invitation/validate-invitation",
      invitationDto
    ).then((res) => res.data),
  accepInvitation: (invitationDto: AcceptInvitationDto) =>
    ApiInstance.post<AcceptInvitationResponse>(
      "/auth/invitation/accept-invitation",
      invitationDto
    ).then((res) => res.data),
};
