<template>
  <NTooltip>
    Lancer l'introduction
    <template #trigger>
      <div
        class="h-8 w-8 grid place-items-center rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 overflow:hidden dark:(bg-gray-700/25 hover:bg-gray-600/25 overflow-hidden) transition-all ease-in-out duration-75"
        @click="ShowOnboarding"
      >
        <i:material-symbols:question-mark
          class="transition-all ease-in-out duration-150 transform"
        />
      </div>
    </template>
  </NTooltip>
</template>

<script setup lang="ts">
import { OnboardingEvents } from "@/types/onboarding";

const { DispatchOnboardingEvent } = useOnboardingEvents();

function ShowOnboarding() {
  DispatchOnboardingEvent(OnboardingEvents.startOnboarding);
}
</script>
