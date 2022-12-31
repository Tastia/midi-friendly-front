<script setup lang="ts">
import { onKeyPressed } from "@vueuse/core";
import { ChatMessageDto } from "@/types/chat";

const emit = defineEmits<{
  (e: "sendMessage", data: ChatMessageDto["message"]): void;
}>();
const textMessage = ref<string>("");

onKeyPressed("Enter", SendTextMessage);
function SendTextMessage() {
  if (textMessage.value) {
    emit("sendMessage", { type: "text", content: textMessage.value });
    textMessage.value = "";
  }
}
</script>

<template>
  <div class="flex items-center gap-1.5 w-full">
    <NInput
      v-model:value="textMessage"
      class="w-full"
      round
      placeholder="Entrez votre message..."
    />
    <NButton type="primary" circle @click="SendTextMessage">
      <template #icon>
        <NIcon>
          <i:mdi:send />
        </NIcon>
      </template>
    </NButton>
  </div>
</template>
