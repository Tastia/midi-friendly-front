import { SweetformPlugin, type SweetformPluginConfig } from "@chronicstone/vue-sweetforms";

export default defineNuxtPlugin((nuxtApp) => {
  const sweetformsConfig: SweetformPluginConfig = {
    textOverrides: {
      nextBtnMessage: "SUIVANT",
      prevBtnMessage: "PRÉCÉDENT",
      cancelBtnMessage: "ANNULER",
      submitBtnMessage: "CONFIRMER",
      requiredMessage: (label) => `Le champ ${label.toLocaleLowerCase()} doit être rempli`,
    },
    uiConfig: {},
  };
  nuxtApp.vueApp.use(SweetformPlugin, sweetformsConfig);
});
