<script setup lang="ts">
import { MapUser } from "@/types/mapGateway";

const showMenu = ref<boolean>(false);
const { width } = useWindowSize();

const userStore = useUserStore();
const gatewayApi = inject(mapApiInjectionKey);

const mappedUsersList = computed(() =>
  gatewayApi?.users.value
    .filter((user) => user._id !== userStore.user?._id)
    .sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return 0;
    })
);
</script>

<template>
  <NTooltip placement="left">
    Liste des utilisateurs
    <template #trigger>
      <NButton type="primary" @click="showMenu = true">
        <template #icon>
          <i:mdi:user />
        </template>
      </NButton>
    </template>
  </NTooltip>

  <NDrawer
    v-model:show="showMenu"
    :width="width < 580 ? width : 580"
    placement="right"
    mask-closable
  >
    <NDrawerContent closable>
      <template #header>
        <span class="text-2xl font-black">
          Utilisateurs de {{ userStore.activeOrganization?.name }}
        </span>
      </template>

      <div class="flex flex-col gap-4">
        <div
          v-if="!mappedUsersList?.length"
          class="h-32 grid place-items-center"
        >
          <NEmpty description="Aucun utilisateur" />
        </div>
        <MapProfileUser
          v-for="user in mappedUsersList"
          :key="user._id"
          :user="user"
        />
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
