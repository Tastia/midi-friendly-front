import { VNodeChild } from "vue";
import { VOnboardingWrapperOptions } from "./onboardingWrapper";

export type AttachableElement = string | (() => Element | null);

export interface OnboardingStep {
  content: {
    title: string | (() => VNodeChild);
    description?: string | (() => VNodeChild);
  };
  on?: {
    beforeStep?: () => void | Promise<void>;
    afterStep?: () => void | Promise<void>;
  };
  attachTo: {
    element: AttachableElement;
    classList?: string[];
  };
  options?: VOnboardingWrapperOptions;
}
