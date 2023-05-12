<script setup lang="ts">
import { MapLunchGroupPoll } from "@/types/mapGateway";
import { useThemeVars } from "naive-ui";

const themeVars = useThemeVars();
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

const { users, voteState, voteOptions, timeLeft, timeLeftPercentage, userHasVoted, userVoteValue } =
  useLunchGroupPoll(props.groupPoll);

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
      <div class="grid grid-cols-2 gap-2">
        <NButton class="w-full" type="primary" secondary @click="SetUserVote">
          <template #icon>
            <i:fluent:vote-20-filled />
          </template>
          {{ userHasVoted ? "CHANGER MON VOTE" : "VOTER" }}
        </NButton>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-semibold">Temps restant</span>
          <span class="font-semibold">{{ timeLeft }}</span>
        </div>
        <NProgress
          type="line"
          :percentage="timeLeftPercentage"
          :show-indicator="false"
          :color="timerProgressColor"
          :height="10"
          :border-radius="themeVars.borderRadius"
          processing
        />
      </div>
      <NDivider class="!m-0" />
      <div class="flex flex-col gap-2">
        <li class="flex items-center justify-between">
          <b class="font-medium">Heure de fin du vote:</b>
          <span>{{ formatTimeHour(groupPoll.voteDeadline) }}</span>
        </li>

        <li class="flex items-center justify-between">
          <b class="font-medium">Heure de rendez-vous:</b>
          <span>{{ formatTimeHour(groupPoll.meetingTime) }}</span>
        </li>

        <li
          class="flex gap-2 items-start justify-between"
          :class="!groupPoll.description ? 'flex-row' : 'flex-col'"
        >
          <b class="font-medium">Description :</b>
          <div
            class="bg-blue-gray-500/10 w-full h-auto p-2 !pr-0.5"
            :style="{ borderRadius: themeVars.borderRadius }"
          >
            <NScrollbar class="max-h-32 italic text-gray-500 whitespace-pre pr-2">
              {{ groupPoll.description || "N/A" }}
            </NScrollbar>
          </div>
        </li>
      </div>
      <NDivider class="!m-0" />
      <div class="flex flex-col gap-3">
        <div v-for="voteItem in voteState" :key="voteItem?.restaurant?._id" class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <NEllipsis :style="{ maxWidth: '80%' }">
              <span>{{ voteItem.restaurant.name }}</span>
            </NEllipsis>
            <span class="text-xs text-gray-500"> {{ voteItem.voteCount.percentage }} % </span>
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
    </div>
  </NCard>
</template>
