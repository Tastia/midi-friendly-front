<script setup lang="ts">
defineProps<{
  isOwner: boolean;
  message: { type: "text" | "image" | "audio" | "video"; content: string };
  pending?: boolean;
}>();
</script>

<template>
  <NSpin :show="pending" size="small">
    <NEl
      class="p-2.5 rounded-md w-full"
      :class="{
        'bg-gray-200 dark:bg-gray-700/30': !isOwner,
        'bg-primary': isOwner,
      }"
    >
      <template v-if="message.type === 'text'">
        {{ message.content }}
      </template>

      <template v-if="message.type === 'image'">
        <NImage width="100%" height="auto" />
      </template>
    </NEl>
  </NSpin>
</template>
