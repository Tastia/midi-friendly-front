<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { CustomMarker } from "vue3-google-map";

const userStore = useUserStore();
const themeVars = useThemeVars();
const props = defineProps<{
  position: { latitude: number; longitude: number };
}>();
</script>

<template>
  <CustomMarker
    :options="{
      position: { lat: position.latitude, lng: position.longitude },
      anchorPoint: 'BOTTOM_CENTER',
    }"
  >
    <NTooltip>
      {{ userStore.activeOrganization?.name }}
      <template #trigger>
        <NAvatar :color="themeVars.primaryColor">
          <i:mdi:office-building class="font-bold text-[50px] text-shadow text-white" />
        </NAvatar>
      </template>
    </NTooltip>
  </CustomMarker>
</template>
