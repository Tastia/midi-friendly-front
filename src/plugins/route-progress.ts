import { createDiscreteApi } from "naive-ui";

export default defineNuxtPlugin((nuxtApp) => {
  const appStore = useAppStore();

  const { loadingBar } = createDiscreteApi(["loadingBar"], {
    configProviderProps: {
      theme: appStore.theme,
      themeOverrides: appStore.themeOverrides,
    },
  });

  nuxtApp.hook("app:beforeMount", () => {
    loadingBar.start();
  });

  nuxtApp.hook("app:mounted", () => {
    loadingBar.finish();
  });

  nuxtApp.hook("page:start", () => {
    loadingBar.start();
  });

  nuxtApp.hook("page:transition:finish", () => {
    loadingBar.finish();
  });
});
