<script setup lang="ts">
import { pipeMergeObject } from "@/utils/data/object";
import { OnboardingStep } from "../types/onboardingStep";
import {
  VOnboardingWrapperOptions,
  defaultVOnboardingWrapperOptions,
} from "../types/onboardingWrapper";
import VOnboardingStep from "./VOnboardingStep.vue";

const emit = defineEmits<{ (e: "completed"): void }>();
// eslint-disable-next-line vue/no-setup-props-destructure
const { steps, options = {} } = defineProps<{
  steps: OnboardingStep[];
  options?: VOnboardingWrapperOptions;
}>();

const isRunning = ref<boolean>(false);
const isOperationPending = ref<boolean>(false);
const currentStepIndex = ref<number>(0);

const mergedOptions = computed<VOnboardingWrapperOptions>(() =>
  pipeMergeObject(defaultVOnboardingWrapperOptions, options)
);
const activeStep = computed<OnboardingStep>(
  () => steps[currentStepIndex.value]
);

const isFirstStep = computed<boolean>(() => currentStepIndex.value === 0);
const isLastStep = computed<boolean>(
  () => currentStepIndex.value === steps.length - 1
);

async function StartOnboarding(index = 0) {
  currentStepIndex.value = index;
  await steps?.[index]?.on?.beforeStep?.();
  await nextTick();
  isRunning.value = true;
}

async function FinishOnboarding() {
  isRunning.value = false;
  currentStepIndex.value = 0;
  await activeStep.value?.on?.afterStep?.();
  await nextTick();
  emit("completed");
}

function SetStepIndex(index: number) {
  currentStepIndex.value = index;
}

async function NextStep() {
  if (!steps[currentStepIndex.value + 1]) return FinishOnboarding();

  isOperationPending.value = true;
  await activeStep?.value?.on?.afterStep?.();
  await steps?.[currentStepIndex.value + 1]?.on?.beforeStep?.();
  await nextTick();
  isOperationPending.value = false;
  currentStepIndex.value = currentStepIndex.value + 1;
}

async function PreviousStep() {
  if (!steps[currentStepIndex.value - 1]) return;

  isOperationPending.value = true;
  await activeStep.value?.on?.afterStep?.();
  await steps[currentStepIndex.value - 1]?.on?.beforeStep?.();
  isOperationPending.value = false;
  currentStepIndex.value = currentStepIndex.value - 1;
}

defineExpose({
  StartOnboarding,
  FinishOnboarding,
  SetStepIndex,
  index: readonly(currentStepIndex),
});
</script>

<template>
  <div v-if="isRunning">
    <VOnboardingStep
      :key="currentStepIndex"
      :step="activeStep"
      :options="mergedOptions"
      :index="currentStepIndex"
      :total-steps="steps.length"
      :is-first="isFirstStep"
      :is-last="isLastStep"
      @next="NextStep"
      @previous="PreviousStep"
    />
  </div>
</template>
