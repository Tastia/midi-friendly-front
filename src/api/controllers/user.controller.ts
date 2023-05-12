import { ApiInstance } from "@/api/instance";
export const UserController = {
  completeOnboarding: () => ApiInstance.post("/users/complete-onboarding").then((res) => res.data),
};
