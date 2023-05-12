<script setup lang="ts">
import { OnboardingStep } from "../types/onboardingStep";
import { VOnboardingWrapperOptions } from "../types/onboardingWrapper";
import { pipeMergeObject } from "@/utils/data/object";
import useGetElement from "../composables/useGetElement";
import { createPopper } from "@popperjs/core";
import useSvgOverlay from "../composables/useSvgOverlay";
import { renderVNode } from "@/utils/vue/renderVNode";

defineEmits<{
  (e: "next"): void;
  (e: "previous"): void;
}>();
// eslint-disable-next-line vue/no-setup-props-destructure
const { step, options } = defineProps<{
  index: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  step: OnboardingStep;
  options: VOnboardingWrapperOptions;
}>();

const { width } = useWindowSize();
const { updatePath, path } = useSvgOverlay();

const stepElement = ref<HTMLElement>();
const mergedOptions = computed(() => pipeMergeObject(options, step?.options ?? {}));

function AttachElement() {
  const element = useGetElement(step.attachTo.element);
  if (element && stepElement.value) {
    if (mergedOptions.value?.scrollToStep?.enabled) {
      element.scrollIntoView(mergedOptions.value?.scrollToStep?.options);
    }
    createPopper(element, stepElement.value, mergedOptions.value.popper);
    if (mergedOptions.value?.overlay?.enabled) {
      updatePath(element, {
        padding: mergedOptions.value?.overlay?.padding,
        borderRadius: mergedOptions.value?.overlay?.borderRadius,
      });
    }
    SetTargetElementClassName(element);
  }
}

function SetTargetElementClassName(element = useGetElement(step.attachTo.element)) {
  const classList = step.attachTo.classList;
  if (!classList || !element) return;
  element.classList.add(...classList);
}

function UnsetTargetElementClassName(element = useGetElement(step.attachTo.element), classList?: string[]) {
  if (!classList || !element) return;
  element.classList.remove(...classList);
}

onMounted(() => AttachElement());
onUnmounted(() =>
  UnsetTargetElementClassName(useGetElement(step.attachTo?.element), step.attachTo?.classList)
);
</script>

<template>
  <div>
    <svg
      style="
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        opacity: 0.5;
        z-index: 10000;
        pointer-events: none;
      "
    >
      <path :d="path" />
    </svg>

    <div ref="stepElement" style="position: relative; z-index: 10050">
      <Transition name="scale-fade" mode="out-in" appear>
        <NCard :style="{ width: width < 400 ? width - 20 + 'px' : '400px' }">
          <template #header>
            <Component :is="renderVNode(step.content.title)" />
          </template>

          <template #header-extra> {{ index + 1 }}/{{ totalSteps }} </template>

          <template #footer>
            <div class="flex items-center gap-2">
              <NButton v-if="!isFirst" class="w-1/2" type="primary" @click="$emit('previous')">
                Précédent
              </NButton>
              <NButton
                v-if="!isLast"
                :class="!isFirst ? 'w-1/2' : 'w-full'"
                type="primary"
                @click="$emit('next')"
              >
                Suivant
              </NButton>
              <NButton v-if="isLast" class="w-1/2" type="primary" @click="$emit('next')"> Fermer </NButton>
            </div>
          </template>

          <NScrollbar :style="{ maxHeight: '400px' }">
            <Component :is="renderVNode(step.content.description)" />
          </NScrollbar>
        </NCard>
      </Transition>
    </div>
  </div>
</template>
