<script setup lang="ts">
import { MapLunchGroupPoll } from "@/types/mapGateway";
import { useSweetform } from "@chronicstone/vue-sweetforms";
import { useThemeVars } from "naive-ui";

const themeVars = useThemeVars();
const formApi = useSweetform();
const props = defineProps<{ groupPoll: MapLunchGroupPoll }>();
const emit = defineEmits<{
  (
    event: "setUserVote",
    payload: {
      groupId: string;
      voteOptions: Array<{ label: string; value: string }>;
      userCurrentVote: string | null;
    }
  ): void;
}>();

const {
  users,
  voteState,
  voteOptions,
  timeLeft,
  timeLeftPercentage,
  userHasVoted,
  userVoteValue,
} = useLunchGroupPoll(props.groupPoll);

const timerProgressColor = computed(() => {
  if (timeLeftPercentage.value > 50) return themeVars.value.successColor;
  else if (timeLeftPercentage.value > 25) return themeVars.value.warningColor;
  else return themeVars.value.warningColor;
});

async function SetUserVote() {
  emit("setUserVote", {
    groupId: props.groupPoll._id,
    voteOptions: voteOptions.value,
    userCurrentVote: userVoteValue.value,
  });
}
</script>

<template>
  <NCard embedded :segmented="{ content: true, footer: true }">
    <template #header>
      <NEllipsis :style="{ maxWidth: '40%' }">
        <span>{{ groupPoll.label }}</span>
      </NEllipsis>
    </template>

    <template #header-extra>
      <MapUserStack size="small" :users="users" />
    </template>

    <template #footer>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">Temps restant</span>
          <span class="text-xs text-gray-500">{{ timeLeft }}</span>
        </div>
        <NProgress
          type="line"
          :percentage="timeLeftPercentage"
          :show-indicator="false"
          :color="timerProgressColor"
          :height="16"
          :border-radius="themeVars.borderRadius"
          processing
        />
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-3">
        <div
          v-for="voteItem in voteState"
          :key="voteItem?.restaurant?._id"
          class="flex flex-col gap-1.5"
        >
          <div class="flex items-center justify-between">
            <NEllipsis :style="{ maxWidth: '80%' }">
              <span>{{ voteItem.restaurant.name }}</span>
            </NEllipsis>
            <span class="text-xs text-gray-500">
              {{ voteItem.voteCount.percentage }} %
            </span>
          </div>
          <NProgress
            type="line"
            :percentage="voteItem.voteCount.percentage"
            :show-indicator="false"
            :color="themeVars.primaryColor"
            :height="10"
            :border-radius="themeVars.borderRadius"
          />
        </div>
      </div>
      <NButton type="primary" secondary class="w-full" @click="SetUserVote">
        <template #icon>
          <i:fluent:vote-20-filled />
        </template>
        {{ userHasVoted ? "CHANGER MON VOTE" : "VOTER" }}
      </NButton>
    </div>
  </NCard>
</template>
