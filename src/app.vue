<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
} from "naive-ui";
import { FormProvider } from "@chronicstone/vue-sweetforms";
import "@chronicstone/vue-sweetforms/dist/style.css";
import { OnboardingEvents } from "./types/onboarding";

const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();

const { DispatchOnboardingEvent } = useOnboardingEvents();

watch(
  () => appStore.isDark,
  (isDark: boolean) => {
    if (isDark) document?.querySelector("body")?.classList.add("dark");
    else document?.querySelector("body")?.classList.remove("dark");
  },
  { immediate: true }
);

watch(
  () => route.name,
  (name) => {
    if (name === "map" && userStore.user && !userStore.user?.onboarded)
      DispatchOnboardingEvent(OnboardingEvents.startOnboarding);
  },
  { immediate: true }
);
</script>

<template>
  <n-config-provider
    id="appRoot"
    class="demo"
    :locale="appStore.language"
    :theme="appStore.theme"
    :theme-overrides="appStore.themeOverrides"
  >
    <form-provider
      :dark-mode="appStore.isDark"
      :theme-overrides="appStore.themeOverrides"
    >
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-loading-bar-provider>
              <n-spin :show="appStore.isLoading">
                <template v-if="appStore.isLoadingMessage" #description>
                  <span class="font-black text-primary">
                    {{ appStore.isLoadingMessage }}
                  </span>
                </template>
                <UserOnboarding />
                <div
                  id="onboarding-start"
                  class="fixed top-[40%] left-1/2 opacity-0"
                  style="z-index: -1"
                ></div>
                <NuxtLayout>
                  <NuxtPage />
                </NuxtLayout>
              </n-spin>
            </n-loading-bar-provider>
          </n-notification-provider>
        </n-message-provider>
      </n-dialog-provider>
    </form-provider>
  </n-config-provider>
</template>

<style>
body {
  font-family: "Lato" !important;
}

.n-dialog {
  z-index: 20000 !important;
}
</style>
