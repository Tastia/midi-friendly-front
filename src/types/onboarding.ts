import { VNodeChild } from "vue";
export enum OnboardingEvents {
  startOnboarding = "startOnboarding",
  openUserMenu = "openUserMenu",
  closeUserMenu = "closeUserMenu",
  openRestaurantProfile = "openRestaurantProfile",
  closeRestaurantProfile = "closeRestaurantProfile",
  openCreateGroupForm = "openCreateGroupForm",
  closeCreateGroupForm = "closeCreateGroupForm",
  openPollMenu = "openPollMenu",
  closePollMenu = "closePollMenu",
  openCreatePollForm = "openCreatePollForm",
  closeCreatePollForm = "closeCreatePollForm",
}

export type OnboardingStep = {
  attachTo: {
    element: string;
    classList?: string[];
  };
  content: {
    title: string | (() => VNodeChild);
    description: string | (() => VNodeChild);
  };
  on?: {
    beforeStep?: () => void | Promise<void>;
    afterStep?: () => void | Promise<void>;
  };
  options?: {
    popper?: {
      placement?:
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "auto"
        | "auto-start"
        | "auto-end"
        | "top-start"
        | "top-end"
        | "bottom-start"
        | "bottom-end"
        | "right-start"
        | "right-end"
        | "left-start"
        | "left-end";
      modifiers?: Array<{
        name: string;
        options: { offset?: [number, number] };
      }>;
    };
  };
};
