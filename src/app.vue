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
const appStore = useAppStore();

watch(
  () => appStore.isDark,
  (isDark: boolean) => {
    if (isDark) document?.querySelector("body")?.classList.add("dark");
    else document?.querySelector("body")?.classList.remove("dark");
  },
  { immediate: true }
);
</script>

<template>
  <n-config-provider
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
              <NuxtLayout>
                <NuxtPage />
              </NuxtLayout>
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
</style>