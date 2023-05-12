<script setup lang="tsx">
import { ParsedMapLunchGroup } from "@/composables/useRestaurantLunchGroups";
import { useThemeVars } from "naive-ui";
import { Restaurant } from "@/types/restaurant";

const props = withDefaults(
  defineProps<{
    group: ParsedMapLunchGroup;
    showRestaurantInfo?: boolean;
    drawerPosition?: "left" | "right";
    highlightActive?: boolean;
  }>(),
  {
    highlightActive: true,
    showRestaurantInfo: false,
    drawerPosition: "left",
  }
);

const userStore = useUserStore();
const themeVars = useThemeVars();
const gatewayApi = inject(mapApiInjectionKey);

const { width } = useWindowSize();
const showDetails = ref<boolean>(false);
const userBelongsToGroup = computed<boolean>(() =>
  props.group.users.some((user) => user._id === userStore.user?._id)
);

const userOwnsGroup = computed<boolean>(() => props.group.owner._id === userStore.user?._id);

const restaurant = computed<Restaurant | undefined>(() =>
  gatewayApi?.restaurants.value.find((restaurant) => restaurant._id === props.group.restaurant)
);

const isLunchGroupExpired = computed<boolean>(() => {
  const now = new Date();
  const meetingTime = new Date(props.group.meetingTime);
  return now > meetingTime;
});

async function JoinGroup() {
  const existingGroup = gatewayApi?.lunchGroups.value.find(
    (group) =>
      group.users.some((user) => user === userStore.user?._id) && group.restaurant === props.group.restaurant
  );
  if (existingGroup) {
    const proceed = await useConfirmDialog({
      type: "warning",
      title: "Quitter le groupe existant",
      content: () => (
        <div class="flex flex-col gap-2">
          <span>
            Vous êtes déjà dans un groupe pour ce restaurant, prévu à
            {formatTimeFromTimestamp(existingGroup.meetingTime)}. Voulez-vous quitter ce groupe pour rejoindre
            celui-ci ?
          </span>
          {existingGroup.owner === userStore.user?._id && (
            <span class="text-red-500">
              Vous êtes le propriétaire du groupe existant, si vous quittez ce groupe, il sera supprimé.
            </span>
          )}
        </div>
      ),
    });
    if (!proceed) return;
    if (existingGroup.owner === userStore.user?._id) gatewayApi?.DeleteGroup(existingGroup._id);
    else gatewayApi?.LeaveGroup(existingGroup._id);
  }

  gatewayApi?.JoinGroup(props.group._id);
}

async function LeaveGroup() {
  const proceed = await useConfirmDialog({
    type: "warning",
    title: "Quitter le groupe",
    content: "Êtes-vous sûr de vouloir quitter ce groupe ?",
  });
  if (!proceed) return;
  showDetails.value = false;
  gatewayApi?.LeaveGroup(props.group._id);
}

async function DeleteGroup() {
  const proceed = await useConfirmDialog({
    type: "error",
    title: "Supprimer le groupe",
    content: "Êtes-vous sûr de vouloir supprimer ce groupe ?",
  });
  if (!proceed) return;
  showDetails.value = false;
  gatewayApi?.DeleteGroup(props.group._id);
}
</script>

<template>
  <NCard
    :segmented="{ content: true }"
    embedded
    :theme-overrides="userBelongsToGroup && highlightActive ? { borderColor: themeVars.primaryColor } : {}"
  >
    <template #header>
      <div v-if="showRestaurantInfo" class="flex flex-col gap-2">
        <span>{{ restaurant?.name }}</span>
      </div>
    </template>
    <div class="flex gap-4 items-center justify-between">
      <div class="flex flex-col gap-2">
        <span class="font-bold">{{ group.label }}</span>
        <span>
          Réservation prévue pour
          <NEl tag="b" class="text-[var(--primary-color)]">
            {{ formatTimeFromTimestamp(group.meetingTime) }}
          </NEl>
        </span>
        <MapUserStack :users="group.users" />
      </div>
      <div class="flex items-center gap-2">
        <NTooltip>
          Afficher les détails
          <template #trigger>
            <NButton size="small" secondary @click="showDetails = true">
              <template #icon>
                <i:material-symbols:info />
              </template>
            </NButton>
          </template>
        </NTooltip>

        <NTooltip v-if="!userBelongsToGroup">
          Rejoindre le groupe
          <template #trigger>
            <NButton
              size="small"
              secondary
              type="primary"
              :disabled="!!gatewayApi?.pendingOperation.value"
              :loading="gatewayApi?.pendingOperation.value === 'JoinGroup'"
              @click="JoinGroup"
            >
              <template #icon>
                <i:ic:baseline-log-in />
              </template>
            </NButton>
          </template>
        </NTooltip>

        <NTooltip v-if="userBelongsToGroup && !userOwnsGroup">
          Quitte le groupe
          <template #trigger>
            <NButton
              size="small"
              secondary
              type="error"
              :disabled="!!gatewayApi?.pendingOperation.value"
              :loading="gatewayApi?.pendingOperation.value === 'LeaveGroup'"
              @click="LeaveGroup"
            >
              <template #icon>
                <i:ic:baseline-log-out />
              </template>
            </NButton>
          </template>
        </NTooltip>

        <NTooltip v-if="userOwnsGroup">
          Supprimer le groupe
          <template #trigger>
            <NButton
              size="small"
              secondary
              type="error"
              :disabled="!!gatewayApi?.pendingOperation.value"
              :loading="gatewayApi?.pendingOperation.value === 'DeleteGroup'"
              @click="DeleteGroup"
            >
              <template #icon>
                <i:mdi:trash />
              </template>
            </NButton>
          </template>
        </NTooltip>
      </div>
    </div>
  </NCard>

  <NDrawer
    v-model:show="showDetails"
    :z-index="850"
    mask-closable
    :width="width < 580 ? width : 580"
    :placement="drawerPosition"
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <h2 class="text-2xl font-black">
          <span>Restaurant </span>
          <NEl tag="span" class="text-[var(--primary-color)]">
            {{ restaurant?.name }}
          </NEl>
        </h2>
      </template>

      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-4">
          <h3 class="text-xl font-black">Informations sur le groupe</h3>
          <NCard embedded>
            <ul class="flex flex-col gap-4">
              <li class="flex items-center justify-between">
                <b class="font-black">Label du groupe :</b>
                <span>{{ group.label }}</span>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Créateur du groupe :</b>
                <NEl
                  tag="span"
                  :class="{
                    'text-[var(--primary-color)]': group.owner._id === userStore.user?._id,
                  }"
                >
                  {{ group.owner.firstName }} {{ group.owner.lastName }}
                </NEl>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Date de rendez-vous :</b>
                <span>{{ formatDateTime(group.meetingTime) }}</span>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Date de création :</b>
                <span>{{ formatDateTime(group.createdAt) }}</span>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Nom du restaurant :</b>
                <span>{{ restaurant?.name }}</span>
              </li>

              <li
                class="flex gap-2 items-start justify-between"
                :class="!group.description ? 'flex-row' : 'flex-col'"
              >
                <b class="font-black">Description :</b>
                <div
                  class="bg-blue-gray-500/10 w-full h-auto p-2 !pr-0.5"
                  :style="{ borderRadius: themeVars.borderRadius }"
                >
                  <NScrollbar class="max-h-32 italic text-gray-500 whitespace-pre pr-2">
                    {{ group.description || "N/A" }}
                  </NScrollbar>
                </div>
              </li>
            </ul>
          </NCard>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="text-xl font-black">Participants</h3>
          <MapProfileUser
            v-for="user in group.users"
            :key="user._id"
            :user="user"
            :highlight="user._id === userStore.user?._id"
          />
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
