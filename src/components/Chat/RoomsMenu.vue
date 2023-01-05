<script setup lang="ts">
import { ChatRoom } from "@/types/chat";
import { NSkeleton } from "naive-ui";

const showMenu = ref<boolean>(false);
const { width } = useWindowSize();
const rooms = ref<ChatRoom[]>([]);

const isLoading = ref<boolean>(false);
const chatApi = inject(chatApiInjectionKey);
const scrollContainer = ref<HTMLElement>();

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

onMounted(() => {
  LoadRooms();
});
</script>

<template>
  <NPopover
    v-model:show="showMenu"
    :style="{ width: `${width < 420 ? width : 420}px` }"
    :content-style="{ padding: '10px 0 10px 10px' }"
    trigger="click"
    display-directive="show"
  >
    <template #trigger>
      <slot>
        <NButton size="small" secondary circle>
          <template #icon> <i:ph:chat-circle-text-fill /> </template>
        </NButton>
      </slot>
    </template>

    <template #header>
      <div class="flex flex-col gap-1">
        <h2 class="text-xl font-black">Discussions</h2>
        <NInput round size="small" placeholder="Rechercher une discussion..." />
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
        <NCard
          class="cursor-pointer"
          hoverable
          embedded
          @click="showMenu = false"
        >
          <div class="flex items-center gap-2">
            {{ room?.lunchGroupPoll?.label ?? room?.lunchGroup?.label ?? "" }}
          </div>
        </NCard>
      </ChatDiscussion>

      <template v-if="isLoading">
        <NSkeleton height="40px" :sharp="false" />
      </template>
    </div>
  </NPopover>
</template>
