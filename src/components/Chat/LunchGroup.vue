<script setup lang="ts">
import { ParsedMapLunchGroup } from "@/composables/useRestaurantLunchGroups";
import { ChatMessage2, ChatMessageDto, ChatRoom } from "@/types/chat";
import { generateUUID } from "@/utils/generator/uuid";
import { User } from "@/types/user";
import { sleep } from "seemly";
import { MapUser } from "@/types/mapGateway";

type PendingChatMessage = {
  _id: string;
  pending: boolean;
  user: User;
  message: ChatMessage2["message"];
  createdAt: ChatMessage2["createdAt"];
  updatedAt?: ChatMessage2["updatedAt"];
};

const props = withDefaults(
  defineProps<{
    group: ParsedMapLunchGroup;
    drawerPosition?: "left" | "right";
  }>(),
  {
    drawerPosition: "left",
  }
);

const isLoading = ref<boolean>(false);
const isOpen = ref<boolean>();
const { width } = useWindowSize();

const userStore = useUserStore();
const chatGatewayApi = inject(chatApiInjectionKey);
const messagesContainer = ref<HTMLElement>();
const messageElements = ref<HTMLElement[]>([]);

const chatroom = ref<ChatRoom>();
const messages = ref<Array<ChatMessage2 | PendingChatMessage>>([]);

useInfiniteScroll(messagesContainer, LoadMoreMessages, {
  direction: "top",
  distance: 0,
  preserveScrollPosition: true,
  behavior: "smooth",
});

async function ScrollToBottom() {
  await nextTick();
  await sleep(10);
  console.log("Scroll to bottom", messageElements.value.length);
  messageElements.value[messageElements.value.length - 1]?.scrollIntoView?.({
    behavior: "smooth",
  });
}

const LoadRoomData = async () =>
  (chatroom.value = await ChatController.getRoomData(props.group.chatRoom));

async function LoadMoreMessages() {
  try {
    isLoading.value = true;
    const newMessagesBatch = await ChatController.getRoomMessages(
      props.group.chatRoom,
      {
        limit: 20,
        offset: messages.value.filter(
          (message) => !(message as PendingChatMessage).pending
        ).length,
      }
    );

    isLoading.value = false;
    messages.value = [...newMessagesBatch, ...messages.value];
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
}

async function SendMessage(message: ChatMessageDto["message"]) {
  if (!chatGatewayApi) return;

  const temporaryId = `temp_${generateUUID()}`;
  messages.value.push({
    _id: temporaryId,
    pending: true,
    user: userStore.user as User,
    message,
    createdAt: new Date().toISOString(),
  });

  ScrollToBottom();

  const { success, messsage, data } = await chatGatewayApi.SendMessage({
    userId: userStore.user?._id as string,
    roomId: props.group.chatRoom,
    message,
  });

  if (success)
    messages.value = messages.value.map((message) =>
      message._id !== temporaryId
        ? message
        : {
            ...message,
            pending: false,
            _id: data?._id as string,
          }
    );
  else {
    console.error(`Send message failed: ${messsage}`);
    messages.value = messages.value.filter(
      (message) => message._id !== temporaryId
    );
  }
}

function DateOffsetPrevMessage(currentMessage: string, prevMessage: string) {
  return (
    new Date(currentMessage).getTime() - new Date(prevMessage).getTime() >
    30 * 60 * 1000 // 30 minutes
  );
}

function HasSameAuthor(
  currentMessage: ChatMessage2 | PendingChatMessage,
  previousMessage: ChatMessage2 | PendingChatMessage
) {
  return currentMessage?.user?._id === previousMessage?.user?._id;
}

const cancelSubscription = chatGatewayApi?.SubscribeToNewMessage(
  (data: { roomId: string; message: ChatMessage2 }) => {
    if (data.roomId === props.group.chatRoom) messages.value.push(data.message);
    ScrollToBottom();
  }
);

watch(
  () => isOpen.value,
  (open) => open && ScrollToBottom()
);

onUnmounted(() => cancelSubscription?.());
onMounted(async () => {
  await LoadMoreMessages();
  await LoadRoomData();
});
</script>

<template>
  <div @click="isOpen = true">
    <slot />
  </div>

  <NDrawer
    v-model:show="isOpen"
    :z-index="1050"
    mask-closable
    :width="width < 580 ? width : 580"
    :placement="drawerPosition"
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <div class="flex items-center gap-2">
          <NEllipsis
            class="text-md text-primary font-black uppercase"
            style="max-width: 50%"
          >
            {{ group.label }}
          </NEllipsis>
          <NDivider vertical />
          <MapUserStack
            :users="((chatroom?.users ?? []) as unknown as MapUser[])"
            size="small"
          />
        </div>
      </template>

      <template #footer>
        <ChatInput :users="chatroom?.users ?? []" @send-message="SendMessage" />
      </template>

      <div
        ref="messagesContainer"
        class="flex flex-col w-full h-[calc(79vh)] overflow-y-scroll pr-4"
      >
        <div v-if="isLoading" class="w-full grid place-items-center">
          <NSpin> Chargement du chat ... </NSpin>
        </div>

        <template v-for="(message, index) in messages" :key="message._id">
          <span
            v-if="
              !messages[index - 1] ||
              DateOffsetPrevMessage(
                message.createdAt,
                messages[index - 1].createdAt
              )
            "
            class="w-auto self-center text-sm text-gray-500 font-medium mt-6"
            round
          >
            {{ formatDateTime(message.createdAt) }}
          </span>

          <NTooltip :delay="250">
            {{ formatDateTime(message.createdAt) }}
            <template #trigger>
              <div
                ref="messageElements"
                class="flex items-end max-w-[80%] w-[fit-content] gap-1.5"
                :class="[
                  {
                    'self-end': message.user._id === userStore.user?._id,
                  },
                  HasSameAuthor(message, messages[index - 1])
                    ? 'mt-2.5'
                    : 'mt-6',
                ]"
              >
                <NAvatar
                  v-if="message.user._id !== userStore.user?._id"
                  round
                  :src="message.user.avatar"
                  size="small"
                >
                  <template v-if="!message.user.avatar">
                    {{
                      getUserInitials(
                        message.user.firstName,
                        message.user.lastName
                      )
                    }}
                  </template>
                </NAvatar>
                <ChatMessage
                  :is-owner="message.user._id === userStore.user?._id"
                  :message="message.message"
                  :pending="(message as PendingChatMessage)?.pending ?? false"
                />
              </div>
            </template>
          </NTooltip>
        </template>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
