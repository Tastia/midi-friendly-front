import { useFormApi } from "@chronicstone/vue-sweettools";
import { useLoadingBar, useMessage, useDialog, useNotification } from "naive-ui";

declare module "#app" {
  interface NuxtApp {
    $formApi: ReturnType<typeof useFormApi>;
    $messageApi: ReturnType<typeof useMessage>;
    $loadingBarApi: ReturnType<typeof useLoadingBar>;
    $dialogApi: ReturnType<typeof useDialog>;
    $notificationApi: ReturnType<typeof useNotification>;
  }
}
