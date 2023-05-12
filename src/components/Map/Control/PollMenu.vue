<script setup lang="ts">
import { CreateGroupPollDto, MapLunchGroupPoll } from "@/types/mapGateway";
import { OnboardingEvents } from "@/types/onboarding";
import { useFormApi } from "@chronicstone/vue-sweettools";

const showMenu = ref<boolean>(false);
const { width } = useWindowSize();

const formApi = useFormApi();
const mapGatewayApi = inject(mapApiInjectionKey);

function SortPollsByDate(polls: MapLunchGroupPoll[]) {
  return polls.sort((a, b) => {
    if (a.voteDeadline > b.voteDeadline) return -1;
    else if (a.voteDeadline < b.voteDeadline) return 1;
    else return 0;
  });
}

async function CreateNewPoll() {
  try {
    showMenu.value = false;
    const { formData, isCompleted } = await formApi.createForm(LunchGroupPollFormSchema());

    showMenu.value = true;
    if (!isCompleted) return;

    mapGatewayApi?.CreateGroupPoll(formData);
  } catch (err) {
    console.error(err);
  }
}

async function SetUserVote(payload: {
  groupId: string;
  voteOptions: Array<{ label: string; value: string }>;
  userCurrentVote: string | null;
}) {
  try {
    showMenu.value = false;
    const { isCompleted, formData } = await formApi.createForm(
      {
        title: "Choisissez un restaurant",
        maxWidth: "500px",
        fieldSize: 9,
        gridSize: 9,
        allowClickOutside: false,
        fields: [
          {
            key: "restaurant",
            label: "Restaurant",
            type: "select",
            required: true,
            placeholder: "Choisissez un restaurant",
            options: payload.voteOptions,
          },
        ],
      },
      payload.userCurrentVote ? { restaurant: payload.userCurrentVote } : undefined
    );

    showMenu.value = true;
    if (!isCompleted) return;

    mapGatewayApi?.SaveUserPollVote({
      pollId: payload.groupId,
      restaurantId: formData.restaurant,
    });
  } catch (err) {
    console.error(err);
  }
}

const { SubscribeOnboardingEvent } = useOnboardingEvents();
const cancelSubscription = SubscribeOnboardingEvent((event: OnboardingEvents) => {
  if (event === OnboardingEvents.openPollMenu) showMenu.value = true;
  if (event === OnboardingEvents.closePollMenu) showMenu.value = false;
}) as () => void;
onUnmounted(() => cancelSubscription());
</script>

<template>
  <NTooltip>
    Gérer les votes
    <template #trigger>
      <NButton id="poll-menu-trigger" type="primary" circle @click="showMenu = true">
        <template #icon>
          <i:fluent:poll-16-filled />
        </template>
      </NButton>
    </template>
  </NTooltip>

  <NDrawer
    v-model:show="showMenu"
    :width="width < 580 ? width : 580"
    placement="right"
    mask-closable
    display-directive="show"
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <span class="text-xl font-black"> Votes en cours </span>
      </template>

      <template #footer>
        <NButton
          :disabled="!!mapGatewayApi?.pendingOperation.value"
          :loading="mapGatewayApi?.pendingOperation.value === 'CreateGroupPoll'"
          type="primary"
          @click="CreateNewPoll"
        >
          <template #icon>
            <i:mdi:plus />
          </template>
          Créer un groupe par vote
        </NButton>
      </template>

      <template v-if="!mapGatewayApi?.lunchGroupPolls.value.length">
        <div id="poll-menu-drawer" class="h-full grid place-items-center">
          <NEmpty description="Aucun vote en cours" />
        </div>
      </template>

      <div v-else id="poll-menu-drawer" class="flex flex-col gap-5">
        <MapProfileGroupPoll
          v-for="poll in SortPollsByDate(mapGatewayApi?.lunchGroupPolls.value ?? [])"
          :key="poll._id"
          :group-poll="poll"
          @set-user-vote="SetUserVote"
        />
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
