<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage, useNotification } from "naive-ui";
import { FormProvider, useFormApi } from "@chronicstone/vue-sweettools";
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

const chatGatewayApi = useChatGateway();
provide(chatApiInjectionKey, chatGatewayApi);

const nuxtApp = useNuxtApp();
const formApi = useFormApi();
const dialogApi = useDialog();
const loadingBarApi = useLoadingBar();
const messageApi = useMessage();
const notificationApi = useNotification();

nuxtApp.provide("formApi", formApi);
nuxtApp.provide("dialogApi", dialogApi);
nuxtApp.provide("loadingBarApi", loadingBarApi);
nuxtApp.provide("messageApi", messageApi);
nuxtApp.provide("notificationApi", notificationApi);
</script>

<template>
  <n-spin :show="appStore.isLoading">
    <template v-if="appStore.isLoadingMessage" #description>
      <span class="font-black text-primary">
        {{ appStore.isLoadingMessage }}
      </span>
    </template>
    <UserOnboarding />
    <div id="onboarding-start" class="fixed top-[40%] left-1/2 opacity-0" style="z-index: -1"></div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </n-spin>
</template>

<style>
body {
  font-family: "Lato" !important;
}

.n-dialog {
  z-index: 20000 !important;
}
</style>
