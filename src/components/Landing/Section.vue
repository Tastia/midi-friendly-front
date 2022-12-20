<script setup lang="ts">
withDefaults(defineProps<{ inverted: boolean }>(), { inverted: false });
</script>

<template>
  <div
    class="flex justify-between w-full items-center gap-20 items-center h-layout px-7.5 md:px-20 lg:px-45 xl:px-60"
    :class="inverted ? ' bg-gray-200/50' : ''"
  >
    <slot />
  </div>
</template>
