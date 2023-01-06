import { ChatRoom } from "./../types/chat";
import { ChatGatewayEmittedEvents } from "@/types/chat";
import {
  ChatGatewayReceivedEvents,
  ChatMessage,
  ChatMessageDto,
} from "@/types/chat";
import io from "socket.io-client";
import { GatewayEventResponse, GatewayUser } from "@/types/mapGateway";

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

  const users = ref<GatewayUser[]>([]);

  // TODO: FIX type inferrence on event dispatcher
  const [SubscribeToNewMessage, dispatchNewMessage] = useEventDispatcher<any>();
  const [SubscribeToNewRoom, dispatchNewRoom] = useEventDispatcher<any>();

  client.on(
    ChatGatewayReceivedEvents.setUserList,
    ({ users: userList }: { users: GatewayUser[] }) => (users.value = userList)
  );

  client.on(
    ChatGatewayReceivedEvents.userConnected,
    ({ userId }: { userId: string }) =>
      (users.value = users.value.map((user) =>
        user._id === userId ? { ...user, isOnline: true } : user
      ))
  );

  client.on(
    ChatGatewayReceivedEvents.userDisconnected,
    ({ userId }: { userId: string }) =>
      (users.value = users.value.map((user) =>
        user._id === userId ? { ...user, isOnline: false } : user
      ))
  );

  client.on(
    ChatGatewayReceivedEvents.messageReceived,
    ({ message }: { message: ChatMessage & { room: string } }) => {
      dispatchNewMessage({ roomId: message.room, message: message });
    }
  );

  client.on(
    ChatGatewayReceivedEvents.addChatRoom,
    ({ room }: { room: ChatRoom }) => dispatchNewRoom(room)
  );

  function SendMessage(
    data: ChatMessageDto
  ): Promise<{ success: boolean; message: ChatMessage }> {
    return new Promise((resolve) =>
      client.emit(
        ChatGatewayEmittedEvents.sendMessage,
        data,
        (response: { success: boolean; message: ChatMessage }) =>
          resolve(response)
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

  return {
    users,
    dispatchNewMessage,
    SubscribeToNewMessage,
    SubscribeToNewRoom,
    SendMessage,
  };
}
