import { getTimeDiff } from "@/utils/format";

export function useTimer(timestamp: string) {
  const value = ref<string>(getTimeDiff(timestamp) as string);
  const interval = setInterval(() => {
    value.value = getTimeDiff(timestamp) as string;
  }, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });

  return value;
}

export function useTimerPercentage(deadline: string, start: string) {
  // RETURN PERCENTAGE OF TIME REMAINING
  const value = ref<number>(getTimeDiff(deadline, start, true) as number);
  const interval = setInterval(() => {
    value.value = getTimeDiff(deadline, start, true) as number;
  }, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });

  return value;
}
