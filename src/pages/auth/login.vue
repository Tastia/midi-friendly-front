<script setup lang="ts">
import { AuthLoginDto } from "@/types/auth";
import { useMessage } from "naive-ui";

definePageMeta({
  middleware: ["no-auth"],
  name: "auth.login",
});

const router = useRouter();
const userStore = useUserStore();
const messageApi = useMessage();

async function Authenticate(data: AuthLoginDto) {
  try {
    const authData = await Authcontroller.login(data);
    userStore.StoreAuthData(authData);
    messageApi.success(
      `Bienvenue, ${authData.account.firstName} ${authData.account.lastName}`
    );
    router.push("/");
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <div class="flex overflow-hidden">
    <div class="h-layout w-full lg:w-1/2 p-16 flex flex-col gap-8">
      <h1 class="font-600 text-lg">Connexion à Midi Friendly</h1>
      <p class="text-gray-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
        minus tenetur odio quas architecto reprehenderit impedit fuga qui quod
      </p>
      <AuthLoginForm @on-submit="Authenticate" />
    </div>
    <div class="w-0 lg:w-1/2 h-layout illu-container-full"></div>
  </div>
</template>

<style lang="scss" scoped>
.illu-container-full {
  background: url("@/assets/images/invitationIllu.png") no-repeat;
  background-size: cover;
}
</style>
