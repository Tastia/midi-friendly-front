import { Organization } from "./../types/organization";
import { AuthLoginData } from "@/types/auth";
import { defineStore } from "pinia";
import { User } from "@/types/user";
import { Serializer, useStorage as useCStorage } from "@vueuse/core";
import { ObjectSerializer } from "@/utils/data/object";

export const useUserStore = defineStore("userStore", () => {
  const refreshToken = ref<string | null>();
  const rememberMe = ref<boolean>(false);

  const organizations = useCStorage<Organization[]>("organizations", [], localStorage, {
    serializer: ObjectSerializer as Serializer<Organization[]>,
  });

  const activeOrganizationId = useCStorage<string | null>("activeOrganizationId", null, localStorage);

  const accessToken = useCStorage<string | null>("refreshToken", null, localStorage);

  const user = useCStorage<(User & { onboarded: boolean }) | null>("user", null, localStorage, {
    serializer: ObjectSerializer as Serializer<User & { onboarded: boolean }>,
  });

  const activeOrganization = computed<Organization | null>(() =>
    user.value ? organizations.value.find((orga) => orga._id === activeOrganizationId.value) ?? null : null
  );

  function StoreAuthData(data: AuthLoginData) {
    accessToken.value = data.accessToken;
    user.value = data.account;
    organizations.value = data.organizations;
    if (data.organizations.length === 1) activeOrganizationId.value = data.organizations[0]._id;
  }

  function ClearUserSession() {
    accessToken.value = null;
    user.value = null;
    organizations.value = [];
    activeOrganizationId.value = null;
  }

  function SetActiveOrganization(id: string) {
    activeOrganizationId.value = id;
  }

  function SetOnboardingCompleted() {
    if (user.value?.onboarded) return;
    UserController.completeOnboarding();
    user.value = { ...user.value, onboarded: true } as User & {
      onboarded: boolean;
    };
  }

  return {
    accessToken,
    refreshToken,
    rememberMe,
    user,
    activeOrganization,
    organizations,
    StoreAuthData,
    ClearUserSession,
    SetActiveOrganization,
    SetOnboardingCompleted,
  };
});
