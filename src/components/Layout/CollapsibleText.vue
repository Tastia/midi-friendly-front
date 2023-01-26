<script setup lang="ts">
import { ref, watch, computed, defineExpose } from "vue";
import { NCollapseTransition } from "naive-ui";

const emit = defineEmits<{
  (e: "expand"): void;
  (e: "collapse"): void;
}>();

const isExpanded = ref<boolean>(false);
const titleElement = ref<HTMLElement>();

defineExpose({
  isExpanded: computed(() => isExpanded.value),
  setExpanded: (value: boolean) => (isExpanded.value = value),
  toggleExpanded: () => (isExpanded.value = !isExpanded.value),
});

watch(
  () => isExpanded.value,
  (value: boolean) => emit(value ? "expand" : "collapse")
);
</script>

<template>
  <div class="flex flex-col">
    <h2
      ref="titleElement"
      class="cursor-pointer text-xl font-bold transition-all ease-in-out duration-100"
      :class="isExpanded ? 'text-primary' : ''"
      @click="isExpanded = !isExpanded"
    >
      <slot name="title" />
    </h2>
    <NCollapseTransition :show="isExpanded">
      <slot />
    </NCollapseTransition>
  </div>
</template>
