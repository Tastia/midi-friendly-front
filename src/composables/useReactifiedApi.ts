import { useSweetform } from "@chronicstone/vue-sweetforms";
import { FormApi } from "@chronicstone/vue-sweetforms/src/types/form";
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification,
} from "naive-ui";
import "naive-ui/es";
import { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import { LoadingBarApiInjection } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
import { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";

let dialogApi: DialogApiInjection | null = null;
let messageApi: MessageApiInjection | null = null;
let notificationApi: NotificationApiInjection | null = null;
let loadingBarApi: LoadingBarApiInjection | null = null;
let formApi: FormApi | null = null;

export const useReactifiedApi = () => {
  if (!dialogApi) dialogApi = useDialog();
  if (!messageApi) messageApi = useMessage();
  if (!notificationApi) notificationApi = useNotification();
  if (!loadingBarApi) loadingBarApi = useLoadingBar();
  if (!formApi) formApi = useSweetform();

  return {
    dialogApi,
    messageApi,
    notificationApi,
    loadingBarApi,
    formApi,
  };
};
