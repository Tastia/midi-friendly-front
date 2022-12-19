<script setup lang="ts">
import { MapUser } from "~~/src/types/mapGateway";
import { NBadge, useThemeVars } from "naive-ui";

const themeVars = useThemeVars();
const props = defineProps<{ users: MapUser[] }>();

function createDropdownOptions(options: Array<{ name: string; src?: string }>) {
  return options.map((option, index) => ({
    key: index,
    label: option.name,
  }));
}

function mapUsersAvatar(users: typeof props.users) {
  return users.map((user) => ({
    name: `${user.firstName} ${user.lastName}`,
    src: user?.avatar ?? "",
    isOnline: user.isOnline,
  }));
}
</script>

<template>
  <n-avatar-group :options="mapUsersAvatar(users)" :size="40" :max="3">
    <template #avatar="{ option: { name, src, isOnline } }">
      <n-tooltip>
        <template #trigger>
          <n-avatar
            v-if="src"
            :src="src"
            :class="isOnline ? 'avatar__online' : 'avatar__offline'"
          />
          <n-avatar
            v-else
            :class="isOnline ? 'avatar__online' : 'avatar__offline'"
          >
            {{
              name
                .split(" ")
                .map((w: string) => w.charAt(0))
                .join("")
            }}
          </n-avatar>
        </template>
        <div class="flex flex-col items-center gap-1">
          <span>{{ name }}</span>
          <span
            :style="`color: ${
              themeVars[isOnline ? 'successColor' : 'errorColor']
            }`"
          >
            {{ isOnline ? "En ligne" : "Hors ligne" }}
          </span>
        </div>
      </n-tooltip>
    </template>
    <template #rest="{ options: restOptions, rest }">
      <n-dropdown :options="createDropdownOptions(restOptions)" placement="top">
        <n-avatar>+{{ rest }}</n-avatar>
      </n-dropdown>
    </template>
  </n-avatar-group>
</template>

<style scoped>
.avatar__online {
  border: 2px solid v-bind("themeVars.successColor");
}

.avatar__offline {
  border: 2px solid #fff;
}
</style>
