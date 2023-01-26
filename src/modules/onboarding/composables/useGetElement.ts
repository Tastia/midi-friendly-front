import { AttachableElement } from "../types/onboardingStep";

export default function useGetElement(element: AttachableElement) {
  if (typeof element === "string") {
    return document.querySelector(element);
  } else if (typeof element === "function") {
    return element();
  }
  return null;
}
