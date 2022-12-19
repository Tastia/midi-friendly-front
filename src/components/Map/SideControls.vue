<script setup lang="ts">
import { CustomControl } from "vue3-google-map";
</script>

<template>
  <CustomControl position="RIGHT_TOP">
    <div class="flex flex-col gap-4 p-4">
      <MapControlUserMenu />

      <MapControlGroupMenu />
    </div>
  </CustomControl>
</template>
