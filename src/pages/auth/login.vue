<script setup lang="ts">
import { AuthLoginDto } from "@/types/auth";
import { useMessage } from "naive-ui";

definePageMeta({
  middleware: ["no-auth"],
  name: "auth.login",
});

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const messageApi = useMessage();

async function Authenticate(data: AuthLoginDto) {
  try {
    appStore.startLoading("Authentification en cours...");
    const authData = await Authcontroller.login(data);
    appStore.stopLoading();
    userStore.StoreAuthData(authData);
    messageApi.success(`Bienvenue, ${authData.account.firstName} ${authData.account.lastName}`);
    router.push("/map");
  } catch (err) {
    console.error(err);
    appStore.stopLoading();
  }
}
</script>

<template>
  <div class="flex overflow-hidden">
    <div class="h-layout w-full !lg:w-2/5 p-16 flex flex-col gap-8">
      <h1 class="font-600 text-lg">Connexion à Midi Friendly</h1>
      <p class="text-gray-500">
        Connectez-vous à votre compte pour accéder à la carte interactive des restaurants Midi Friendly.
      </p>
      <AuthLoginForm @on-submit="Authenticate" />
    </div>
    <NuxtImg class="w-0 !lg:w-3/5 h-layout" src="/invitation/illu.png" sizes="sm:0 lg:60vw" fit="cover" />
    <!-- <div class="w-0 !lg:w-3/5 h-layout illu-container-full"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.illu-container-full {
  background: url("@/assets/images/invitationIllu.png") no-repeat;
  background-size: cover;
}
</style>
