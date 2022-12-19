<script setup lang="ts">
import { useThemeVars } from "naive-ui";

definePageMeta({
  middleware: ["auth"],
});

const userStore = useUserStore();
const themeVars = useThemeVars();

function SelectOrganization(id: string) {
  userStore.SetActiveOrganization(id);
  navigateTo("/");
}
</script>

<template>
  <div
    class="px-8 md:px-16 lg:px-32 xl:px-64 py-4 md:py-8 lg:py-16 xl:py-32 flex flex-col gap-4"
  >
    <h1 class="text-lg font-black">
      Séléctionnez une organisation pour accéder à la carte interactive :
    </h1>

    <div
      v-if="!userStore.organizations.length"
      class="w-full h-[50vh] grid place-items-center"
    >
      <NEmpty> Aucune organisation disponnible sur votre compte. </NEmpty>
    </div>

    <div v-else class="flex flex-col gap-8">
      <NCard
        v-for="orga in userStore.organizations"
        :key="orga._id"
        :theme-overrides="
          orga._id === userStore.activeOrganization?._id
            ? { borderColor: themeVars.primaryColor }
            : {}
        "
      >
        <div class="flex gap-4 items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold">{{ orga.name }}</h2>
            <span class="text-gray-500">ID: {{ orga._id }}</span>
          </div>
          <NButton
            secondary
            type="primary"
            @click="SelectOrganization(orga._id)"
          >
            SELECTIONNER
          </NButton>
        </div>
      </NCard>
    </div>
  </div>
</template>
