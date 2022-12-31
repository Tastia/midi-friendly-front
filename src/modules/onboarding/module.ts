import { addComponent, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "@chronicstone/nuxt-onboarding",
  },
  setup: (options, nuxt) => {
    addComponent({
      name: "VOnboarding",
      filePath: "@/modules/onboarding/components/VOnboarding.vue",
    });
  },
});
