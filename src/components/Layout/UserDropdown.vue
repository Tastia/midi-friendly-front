<script setup lang="ts">
import { useDropdownActions } from "@/composables/useDropdownActions";
import { DropdownMixedOption } from "naive-ui/lib/dropdown/src/interface";

const router = useRouter();
const userStore = useUserStore();

const dropdownOptions = useDropdownActions([
  {
    label: "Changer d'organisation",
    icon: "mi:switch",
    action: () => navigateTo("/settings/select-organization"),
  },
  {
    label: "Se déconnecter",
    icon: "ph:sign-out-bold",
    action: () => {
      userStore.ClearUserSession();
      router.push("/auth/login");
    },
  },
]);
</script>

<template>
  <NDropdown :options="(dropdownOptions as unknown as DropdownMixedOption[])">
    <NAvatar
      round
      v-bind="{ ...(userStore.user?.avatar && { src: userStore.user.avatar }) }"
    >
      <template v-if="!userStore.user?.avatar">
        {{ userStore.user?.firstName?.charAt(0) }}
        {{ userStore.user?.lastName?.charAt(0) }}
      </template>
    </NAvatar>
  </NDropdown>
</template>
