<template>
  <NButton size="small" secondary circle @click="appStore.toggleTheme">
    <template #icon>
      <Transition :name="appStore.isDark ? 'slide-fade' : 'slide-fade-reverse'" mode="out-in">
        <i:mdi-white-balance-sunny
          v-if="appStore.isDark"
          class="transition-all ease-in-out duration-150 transform"
        />
        <i:ic-baseline-dark-mode v-else class="transition-all ease-in-out duration-150 transform" />
      </Transition>
    </template>
  </NButton>
</template>

<script setup lang="ts">
const appStore = useAppStore();
withDefaults(defineProps<{ buttonClass?: string; disableTooltip?: boolean }>(), {
  disableTooltip: false,
  buttonClass: "",
});
</script>
