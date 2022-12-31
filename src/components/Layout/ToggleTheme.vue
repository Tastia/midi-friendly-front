<template>
  <div
    class="h-8 w-8 grid place-items-center rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 overflow:hidden dark:(bg-gray-700/25 hover:bg-gray-600/25 overflow-hidden) transition-all ease-in-out duration-75"
    :class="buttonClass"
    @click="appStore.toggleTheme()"
  >
    <Transition
      :name="appStore.isDark ? 'slide-fade' : 'slide-fade-reverse'"
      mode="out-in"
    >
      <i:mdi-white-balance-sunny
        v-if="appStore.isDark"
        class="transition-all ease-in-out duration-150 transform"
      />
      <i:ic-baseline-dark-mode
        v-else
        class="transition-all ease-in-out duration-150 transform"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore();
withDefaults(
  defineProps<{ buttonClass?: string; disableTooltip?: boolean }>(),
  { disableTooltip: false, buttonClass: "" }
);
</script>
