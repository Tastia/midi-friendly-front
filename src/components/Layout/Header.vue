<script setup lang="ts">
const userStore = useUserStore();
const appStore = useAppStore();
</script>

<template>
  <n-el
    class="bg-[var(--body-color)] border-b border-[var(--border-color)] h-16 w-full"
  >
    <div
      class="flex items-center justify-between max-w-screen-xl w-full mx-auto px-8 py-3 h-full"
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
    </div>
  </n-el>
</template>
