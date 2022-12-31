const [SubscribeOnboardingEvent, DispatchOnboardingEvent] =
  useEventDispatcher<any>();

export function useOnboardingEvents() {
  return {
    SubscribeOnboardingEvent,
    DispatchOnboardingEvent,
  };
}
