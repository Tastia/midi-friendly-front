<script setup lang="ts">
import { GatewayUser } from "@/types/mapGateway";
import { useThemeVars } from "naive-ui";

const themeVars = useThemeVars();
withDefaults(defineProps<{ user: GatewayUser; highlight: boolean }>(), {
  highlight: false,
});
</script>

<template>
  <NCard :theme-overrides="highlight ? { borderColor: themeVars.primaryColor } : {}">
    <div class="flex items-center gap-4 justify-between">
      <div class="flex items-center gap-3">
        <NBadge :type="user.isOnline ? 'success' : 'error'" :processing="user.isOnline" dot>
          <NAvatar :size="40" v-bind="{ ...(user.avatar && { src: user.avatar }) }">
            <template v-if="!user.avatar">
              {{ user.firstName.charAt(0) }} {{ user.lastName.charAt(0) }}
            </template>
          </NAvatar>
        </NBadge>
        <NDivider vertical />
        <div class="flex flex-col gap-0">
          <span class="font-bold text-lg"> {{ user.firstName }} {{ user.lastName }} </span>
          <span class="text-gray-500">{{ user.credentials.email }}</span>
        </div>
      </div>

      <!-- <NTooltip>
              TODO ..
              <template #trigger>
                <NButton class="justify-self-end" secondary>
                  <template #icon>
                    <i:mdi:dots-horizontal />
                  </template>
                </NButton>
              </template>
            </NTooltip> -->
      <span
        class="text-lg font-black transition transition-all ease-in-out duration-100"
        :class="user.isOnline ? 'text-green-500' : 'text-red-500'"
      >
        {{ user.isOnline ? "EN LIGNE" : "HORS LIGNE" }}
      </span>
    </div>
  </NCard>
</template>
