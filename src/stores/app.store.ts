import { darkTheme, enUS, GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import { defineStore } from "pinia";
import { useStorage as useVStorage } from "@vueuse/core";

export const useAppStore = defineStore("appStore", () => {
  const isDark = useVStorage("app-theme", false, localStorage);
  const language = ref<typeof enUS>(enUS);
  const isLoading = ref<boolean>(false);
  const isLoadingMessage = ref<string>("");

  const theme = computed<GlobalTheme | null>(() =>
    isDark.value ? darkTheme : null
  );
  const themeOverrides = computed<GlobalThemeOverrides>(() =>
    isDark.value ? DarkThemeOverrides : LightThemeOverrides
  );

  const toggleTheme = () => (isDark.value = !isDark.value);
  const startLoading = (message?: string) => {
    if (message) isLoadingMessage.value = message;
    isLoading.value = true;
  };
  const stopLoading = () => {
    isLoading.value = false;
    isLoadingMessage.value = "";
  };

  const activeLocale = ref<string>("en_US");
  const localesList = ref<string[]>(["en_US"]);

  return {
    isDark,
    language,
    isLoading,
    isLoadingMessage,
    theme,
    themeOverrides,
    toggleTheme,
    startLoading,
    stopLoading,
    activeLocale,
    localesList,
  };
});
