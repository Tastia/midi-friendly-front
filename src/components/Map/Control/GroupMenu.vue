<script setup lang="ts">
import { ParsedMapLunchGroup } from "@/composables/useRestaurantLunchGroups";

const showMenu = ref<boolean>(false);
const { width } = useWindowSize();

const userStore = useUserStore();
const gatewayApi = inject(mapApiInjectionKey);

const mappedLunchGroups = computed(
  () =>
    gatewayApi?.lunchGroups.value
      .map((group) => ({
        ...group,
        users: group.users.map((userId) => gatewayApi.users.value.find((user) => user._id === userId)),
        owner: gatewayApi.users.value.find((user) => user._id === group.owner),
      }))
      .filter((lunchGroup) => lunchGroup.users.some((user) => user?._id === userStore.user?._id))
      .sort((a, b) => {
        const aDate = new Date(a.meetingTime);
        const bDate = new Date(b.meetingTime);

        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
        return 0;
      }) ?? []
);
</script>

<template>
  <NTooltip placement="left">
    Mes groupes actifs
    <template #trigger>
      <NButton id="group-menu-trigger" class="drop-shadow-xl" type="primary" circle @click="showMenu = true">
        <template #icon>
          <i:material-symbols:restaurant />
        </template>
      </NButton>
    </template>
  </NTooltip>

  <NDrawer
    v-model:show="showMenu"
    :width="width < 580 ? width : 580"
    :z-index="800"
    placement="right"
    mask-closable
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <span class="text-xl font-black"> Mes groupes actifs </span>
      </template>

      <div class="flex flex-col gap-4">
        <div v-if="!mappedLunchGroups?.length" class="h-32 grid place-items-center">
          <NEmpty description="Aucun groupe actif" />
        </div>
        <MapProfileLunchGroup
          v-for="group in mappedLunchGroups"
          :key="group._id"
          :group="(group as ParsedMapLunchGroup)"
          :highlight-active="false"
          drawer-position="right"
          show-restaurant-info
        />
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
