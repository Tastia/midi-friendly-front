<script setup lang="ts">
import { ChatMessage, ChatMessage2, ChatRoom } from "@/types/chat";
import { NSkeleton, useThemeVars } from "naive-ui";
import { User } from "~~/src/types/user";

const userStore = useUserStore();
const themeVars = useThemeVars();
const showMenu = ref<boolean>(false);
const { width } = useWindowSize();

const rooms = ref<ChatRoom[]>([]);
const isLoading = ref<boolean>(false);
const chatApi = inject(chatApiInjectionKey);
const scrollContainer = ref<HTMLElement>();

const nbOfUnreadMessages = computed(
  () =>
    rooms.value
      .map(
        (room) =>
          !room.lastMessage?.readBy?.includes(userStore?.user?._id ?? "")
      )
      .filter(Boolean).length
);

useInfiniteScroll(scrollContainer, LoadRooms, {
  direction: "top",
  distance: 0,
  preserveScrollPosition: true,
  behavior: "smooth",
});

async function LoadRooms() {
  isLoading.value = true;
  rooms.value = [
    ...rooms.value,
    ...(await ChatController.getUserRooms({
      limit: 15,
      offset: rooms.value.length,
    })),
  ];
  isLoading.value = false;
}

function OpenRoom(roomId: string) {
  showMenu.value = false;
  rooms.value
    .find((room) => room._id === roomId)
    ?.lastMessage?.readBy?.push(userStore?.user?._id ?? "");
}

function GetUserFullName(source: string | User) {
  const user =
    typeof source === "string"
      ? chatApi?.users.value.find((user) => user._id === source)
      : source;
  return user ? `${user.firstName} ${user.lastName}` : "";
}

function GetUserAvatar(source: string | User) {
  const user =
    typeof source === "string"
      ? chatApi?.users.value.find((user) => user._id === source)
      : source;
  return {
    src: user?.avatar,
    initials: `${user?.firstName?.charAt(0)}${user?.lastName.charAt(0)}`,
  };
}

const cancelSubscriptionMessage = chatApi?.SubscribeToNewMessage(
  async (data: { roomId: string; message: ChatMessage }) => {
    if (rooms.value.some((room) => room._id === data.roomId)) {
      rooms.value = [
        {
          ...rooms.value.find((room) => room._id === data.roomId),
          lastMessage: data.message,
        } as ChatRoom,
        ...rooms.value.filter((room) => room._id !== data.roomId),
      ];
    } else {
      const room = await ChatController.getRoomData(data.roomId);
      rooms.value = [room, ...rooms.value];
    }
  }
) as () => void;

const cancelSubscriptionRoom = chatApi?.SubscribeToNewRoom((room: ChatRoom) => {
  rooms.value = [room, ...rooms.value];
}) as () => void;

onMounted(() => LoadRooms());
onUnmounted(() => {
  cancelSubscriptionMessage();
  cancelSubscriptionRoom();
});
</script>

<template>
  <NPopover
    v-model:show="showMenu"
    :style="{ width: `${width < 420 ? width : 420}px` }"
    :content-style="{ padding: '0' }"
    trigger="click"
    display-directive="show"
    raw
  >
    <template #trigger>
      <slot>
        <NBadge :value="nbOfUnreadMessages">
          <NButton size="small" secondary circle>
            <template #icon> <i:ph:chat-circle-text-fill /> </template>
          </NButton>
        </NBadge>
      </slot>
    </template>

    <NCard>
      <template #header>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-black">Discussions</h2>
          <NInput
            round
            size="small"
            placeholder="Rechercher une discussion..."
          />
        </div>
      </template>

      <div
        ref="scrollContainer"
        class="flex flex-col w-full gap-2 h-[350px] overflow-y-scroll pr-4"
      >
        <template v-if="!rooms.length">
          <div class="h-full w-full grid place-items-center">
            <NEmpty description="Aucune discussion" />
          </div>
        </template>

        <ChatDiscussion
          v-for="room in rooms"
          :key="room._id"
          :label="room?.lunchGroupPoll?.label ?? room?.lunchGroup?.label ?? ''"
          :room-id="room._id"
        >
          <div
            class="cursor-pointer rounded hover:bg-gray-700/8 dark:hover:bg-gray-200/8 transition-all ease-in-out duration-100"
            style="padding: 10px"
            @click="OpenRoom(room._id)"
          >
            <div class="flex items-center gap-4 w-full">
              <NAvatar v-if="!room?.lastMessage" round size="large">
                {{ room.users.length }}
              </NAvatar>
              <NAvatar
                v-else-if="GetUserAvatar(room.lastMessage?.user as unknown as string).src"
                round
                size="large"
                :src="GetUserAvatar(room.lastMessage?.user as unknown as string).src"
              />
              <NAvatar v-else round size="large">
                {{
                  GetUserAvatar(room.lastMessage?.user as unknown as string)
                    .initials
                }}
              </NAvatar>
              <div class="flex flex-col gap-0">
                <span class="font-medium uppercase">
                  {{
                    room?.lunchGroupPoll?.label ?? room?.lunchGroup?.label ?? ""
                  }}
                </span>
                <span v-if="room.lastMessage" class="text-gray-500">
                  <NEllipsis>
                    {{
                      GetUserFullName(
                        room.lastMessage.user as unknown as string
                      )
                    }}
                    : {{ room.lastMessage?.message.content }}</NEllipsis
                  >
                </span>
                <span v-else class="text-gray-500">
                  <i>Aucun message</i>
                </span>
              </div>
              <NBadge
                v-if="
                  !(room?.lastMessage?.readBy ?? []).includes(
                    userStore.user?._id ?? ''
                  )
                "
                processing
                dot
                type="info"
                class="ml-auto"
              />
            </div>
          </div>
        </ChatDiscussion>

        <template v-if="isLoading">
          <NSkeleton height="40px" :sharp="false" />
        </template>
      </div>
    </NCard>
  </NPopover>
</template>
