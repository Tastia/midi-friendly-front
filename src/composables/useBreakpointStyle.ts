import { useBreakpoints } from "./useBreakpoints";
import { breakpointsTailwind } from "@vueuse/core";
import { computed } from "vue";
import { ComputeStyleModifier } from "~/utils/dom/styleUtils";

interface BreakpointArrayItem {
  key: string;
  value: any;
}

interface BreakpointsConfig {
  reactiveBreakpoints: BreakpointArrayItem[];
  breakpointsDefObject: { [key: string]: number };
  breakpointsKeys: string[];
}

export const useBreakpointStyle = (
  styleString: string | number,
  transformKey?: "boolean" | "grid" | "col" | "maxWidth" | "maxHeight" | "value"
) => {
  const { reactiveBreakpoints, breakpointsDefObject, breakpointsKeys } = useBreakpoints(breakpointsTailwind);
  const mappedStyles = styleString
    .toString()
    .split(" ")
    .map((style) => style.split(":").reverse())
    .map(([style, breakpoint]) => ({
      breakpoint: breakpoint ?? "sm",
      style,
    }));

  const breakpointStyle = breakpointsKeys.reduce((acc: any, breakpoint: string, index: number) => {
    let breakpointValue = mappedStyles.find((style) => style.breakpoint === breakpoint)?.style ?? null;
    if (!breakpointValue) {
      let currentIndex = index - 1;
      while (!breakpointValue && currentIndex >= 0) {
        breakpointValue =
          mappedStyles.find((style) => style.breakpoint === breakpointsKeys[currentIndex])?.style ?? null;
        currentIndex--;
      }
    }

    return { ...acc, [breakpoint]: breakpointValue };
  }, {});

  const currentBreakpointVal = computed(() => {
    const currentBreakpoint = reactiveBreakpoints.value.find(({ value }: any) => value?.value)?.key ?? "sm";
    return transformKey
      ? ComputeStyleModifier(breakpointStyle[currentBreakpoint], transformKey)
      : breakpointStyle[currentBreakpoint];
  });

  return currentBreakpointVal;
};
