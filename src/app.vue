<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
} from "naive-ui";
import { FormProvider } from "@chronicstone/vue-sweettools";
import "@chronicstone/vue-sweetforms/dist/style.css";
import AppProvider from "./AppProvider.vue";

const appStore = useAppStore();
</script>

<template>
  <n-config-provider
    id="appRoot"
    class="demo"
    :locale="appStore.language"
    :theme="appStore.theme"
    :theme-overrides="appStore.themeOverrides"
  >
    <form-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-loading-bar-provider>
              <AppProvider />
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
