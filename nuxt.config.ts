import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import PurgeIcons from "vite-plugin-purge-icons";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  pages: true,
  srcDir: "src",
  imports: {
    dirs: ["stores", "config", "composables", "utils", "api/controllers"],
  },
  alias: {
    "@/.": "./",
  },
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "nuxt-windicss", "@nuxt/image-edge"],
  css: ["@/assets/styles/main.scss"],
  vite: {
    plugins: [
      Components({
        resolvers: [NaiveUiResolver(), IconsResolver({ componentPrefix: "i" })], // Automatically register all components in the `components` directory
      }),
      Icons({
        autoInstall: true,
      }),
      PurgeIcons(),
    ],
  },
  runtimeConfig: {
    public: {
      // apiUrl: import.meta.env.VITE_API_URL,
      // gatewayUrl: import.meta.env.VITE_GATEWAY_URL
    },
  },
  nitro: {
    prerender: {
      routes: ["/"],
    },
  },
  routeRules: {
    "/": { ssr: true },
  },
  app: {
    head: {
      title: "Midi friendly",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
        },
      ],
      script: [{ src: "https://code.iconify.design/1/1.0.0/iconify.min.js" }],
    },
    pageTransition: { name: "slide-fade-reverse", mode: "out-in" },
  },
});
