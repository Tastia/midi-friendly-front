<script setup lang="ts">
const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
const showLogin = computed(() => {
  return route.meta?.showLogin ?? false;
});
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
    <div class="flex items-center gap-1.5">
      <NButton
        v-if="showLogin && !userStore.user"
        type="primary"
        size="small"
        @click="$router.push('/auth/login')"
      >
        Connexion
      </NButton>
      <LayoutUserDropdown v-if="userStore.user" />
      <NDivider vertical class="!m-0" />
      <LayoutOnboardingTrigger v-if="$route.name === 'map'" />
      <LayoutToggleTheme />
    </div>
  </n-el>
</template>
