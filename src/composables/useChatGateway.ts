import { ChatGatewayEmittedEvents, ChatRoom } from "@/types/chat";
import {
  ChatGatewayReceivedEvents,
  ChatMessage,
  ChatMessageDto,
} from "@/types/chat";
import io from "socket.io-client";
import { GatewayEventResponse } from "@/types/mapGateway";
import { c } from "naive-ui";

export function useChatGateway() {
  const userStore = useUserStore();
  const client = io(`${import.meta.env.VITE_GATEWAY_URL}/chat` as string, {
    forceNew: true,
    autoConnect: false,
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${userStore.accessToken}`,
          organizationId: userStore.activeOrganization?._id,
        },
      },
    },
  });

  const rooms = ref<ChatRoom[]>([]);

  // TODO: FIX type inferrence on event dispatcher
  const [SubscribeToNewMessage, dispatchNewMessage] = useEventDispatcher<any>();

  client.on(
    ChatGatewayReceivedEvents.messageReceived,
    ({ message }: { message: ChatMessage & { room: string } }) => {
      dispatchNewMessage({ roomId: message.room, message: message });
    }
  );

  function SendMessage(
    data: ChatMessageDto
  ): Promise<GatewayEventResponse<ChatMessage>> {
    return new Promise((resolve) =>
      client.emit(
        ChatGatewayEmittedEvents.sendMessage,
        data,
        (response: GatewayEventResponse<ChatMessage>) => resolve(response)
      )
    );
  }

  onUnmounted(() => {
    client.disconnect();
  });

  watch(
    () => userStore.user,
    (user) => (user ? client.connect() : client.disconnect()),
    { immediate: true }
  );

  client.on("connect", () => console.log("connected"));
  client.on("disconnect", () => console.log("disconnected"));

  return {
    SubscribeToNewMessage,
    SendMessage,
  };
}
