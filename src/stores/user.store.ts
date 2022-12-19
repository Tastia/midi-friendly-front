import { Organization } from "./../types/organization";
import { AuthLoginData } from "@/types/auth";
import { defineStore } from "pinia";
import { User } from "@/types/user";
import { Serializer, useStorage as useCStorage } from "@vueuse/core";
import { ObjectSerializer } from "@/utils/data/object";

export const useUserStore = defineStore("userStore", () => {
  const refreshToken = ref<string | null>();
  const rememberMe = ref<boolean>(false);

  const organizations = useCStorage<Organization[]>(
    "organizations",
    [],
    sessionStorage,
    { serializer: ObjectSerializer as Serializer<Organization[]> }
  );

  const activeOrganizationId = useCStorage<string | null>(
    "activeOrganizationId",
    null,
    sessionStorage
  );

  const accessToken = useCStorage<string | null>(
    "refreshToken",
    null,
    sessionStorage
  );

  const user = useCStorage<User | null>("user", null, sessionStorage, {
    serializer: ObjectSerializer as Serializer<User>,
  });

  const activeOrganization = computed<Organization | null>(() =>
    user.value
      ? organizations.value.find(
          (orga) => orga._id === activeOrganizationId.value
        ) ?? null
      : null
  );

  function StoreAuthData(data: AuthLoginData) {
    accessToken.value = data.accessToken;
    user.value = data.account;
    organizations.value = data.organizations;
    if (data.organizations.length === 1)
      activeOrganizationId.value = data.organizations[0]._id;
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
  };
});
