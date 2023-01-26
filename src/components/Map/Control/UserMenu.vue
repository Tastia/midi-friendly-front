<script setup lang="ts">
import { GatewayUser } from "@/types/mapGateway";
import { OnboardingEvents } from "@/types/onboarding";

const showMenu = ref<boolean>(false);
const { width } = useWindowSize();

const userStore = useUserStore();
const gatewayApi = inject(mapApiInjectionKey);

const onlineUsers = computed<number>(
  () =>
    gatewayApi?.users.value.filter(
      (user) => user.isOnline && user._id !== userStore.user?._id
    ).length ?? 0
);
const mappedUsersList = computed(() =>
  gatewayApi?.users.value
    .filter((user) => user._id !== userStore.user?._id)
    .sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return 0;
    })
);

const { SubscribeOnboardingEvent } = useOnboardingEvents();
const cancelSubscription = SubscribeOnboardingEvent(
  (event: OnboardingEvents) => {
    if (event === OnboardingEvents.openUserMenu) showMenu.value = true;
    if (event === OnboardingEvents.closeUserMenu) showMenu.value = false;
  }
) as () => void;
onUnmounted(() => cancelSubscription());
</script>

<template>
  <NTooltip placement="left">
    Liste des utilisateurs
    <template #trigger>
      <NBadge show-zero type="success" :value="onlineUsers">
        <NButton
          id="user-menu-trigger"
          circle
          type="primary"
          @click="showMenu = true"
        >
          <template #icon>
            <i:mdi:user />
          </template>
        </NButton>
      </NBadge>
    </template>
  </NTooltip>

  <NDrawer
    v-model:show="showMenu"
    :width="width < 580 ? width : 580"
    placement="right"
    mask-closable
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <span class="text-xl font-black">
          Utilisateurs de {{ userStore.activeOrganization?.name }}
        </span>
      </template>

      <div id="user-menu-drawer" class="flex flex-col gap-4">
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
