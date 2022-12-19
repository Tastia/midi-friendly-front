<script setup lang="ts">
const userStore = useUserStore();
const appStore = useAppStore();
</script>

<template>
  <n-el
    class="flex bg-[var(--body-color)] border-b border-[var(--border-color)] h-16 w-full p-3 flex items-center justify-between"
  >
    <img
      v-if="appStore.isDark"
      src="@/assets/images/LogoDark.svg"
      class="h-8 w-auto"
    />
    <img v-else src="@/assets/images/LogoLight.svg" class="h-8 w-auto" />
    <div class="flex items-center">
      <LayoutUserDropdown v-if="userStore.user" />
      <NDivider vertical />
      <LayoutToggleTheme />
    </div>
  </n-el>
</template>
