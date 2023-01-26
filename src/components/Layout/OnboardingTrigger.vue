<template>
  <NTooltip>
    Lancer l'introduction
    <template #trigger>
      <NButton size="small" secondary circle @click="ShowOnboarding">
        <template #icon>
          <i:material-symbols:question-mark
            class="transition-all ease-in-out duration-150 transform"
          />
        </template>
      </NButton>
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
