<script setup lang="ts">
import {
  AcceptInvitationDto,
  AcceptInvitationResponse,
  AuthLoginDto,
  AuthRegisterDto,
  InvitationPayload,
} from "@/types/auth";
import RegisterForm from "@/components/Auth/RegisterForm.vue";
import LoginForm from "@/components/Auth/LoginForm.vue";
import { useMessage } from "naive-ui";

definePageMeta({
  name: "auth.invitation",
});

const route = useRoute();
const router = useRouter();
const messageApi = useMessage();
const invitation = ref<InvitationPayload>();
const registerMode = ref<"link" | "register">();
const userStore = useUserStore();

const errorMessage = computed<string>(() =>
  invitation.value ? GetErrorMessage(invitation.value) : ""
);

function GetErrorMessage(
  errorFlags: Omit<AcceptInvitationResponse, "success">
) {
  if (errorFlags.notFound) return "Invitation not found";
  else if (errorFlags.alreadyUsed) return "Invitation already used";
  else if (errorFlags.expired) return "Invitation expired";
  else if (errorFlags.maxUsageReached)
    "Maximum number of usage for this invitation already reached";
  return "N/A";
}

async function FetchInvitation() {
  invitation.value = await Authcontroller.validateInvitation({
    invitationId: route.params.invitationId as string,
    ...(route.query.hash && { emailHash: route.query.hash as string }),
  });
}

async function FinaliseRegisterProcess(data: AuthRegisterDto | AuthLoginDto) {
  try {
    const { success, ...errorFlags } = await Authcontroller.accepInvitation({
      invitationId: route.params.invitationId as string,
      ...(route.query.hash && { emailHash: route.query.hash as string }),
      account: {
        mode: registerMode.value as AcceptInvitationDto["account"]["mode"],
        ...(registerMode.value === "link" && {
          linkPayload: data as AuthLoginDto,
        }),
        ...(registerMode.value === "register" && {
          registerPayload: data as AuthRegisterDto,
        }),
      },
    });

    if (success) {
      messageApi.success(
        `${
          registerMode.value === "link" ? "Association" : "Création"
        } du compte réussie !`
      );

      navigateTo("/auth/login");
    } else {
      messageApi.error(GetErrorMessage(errorFlags));
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  FetchInvitation();
  if (userStore.user) userStore.ClearUserSession();
});
</script>

<template>
  <template v-if="!invitation">
    <div class="w-full h-full grid place-items-center">
      <NSpin />
    </div>
  </template>

  <template v-else-if="!invitation.success">
    <div class="w-full h-full grid place-items-center">
      <n-result status="warning" :title="errorMessage" />
    </div>
  </template>

  <template v-else-if="!registerMode">
    <div
      class="px-8 md:px-16 lg:px-32 xl:px-64 py-4 md:py-8 lg:py-16 xl:py-32 flex flex-col gap-10"
    >
      <div class="flex flex-col gap-4 sm:max-w-[60%]">
        <h1 class="font-black text-2xl">
          Vous avez été invité a rejoindre
          {{ invitation.invitation.organization.name }}
        </h1>
        <p class="text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. At possimus
          placeat ipsa ex consequatur ratione quis eos quam quibusdam! Provident
          praesentium non numquam recusandae rerum cumque, quaerat unde dicta
          officia!
        </p>
      </div>

      <div
        class="flex flex-col !sm:flex-row gap-8 justify-between items-center w-full"
      >
        <div
          class="w-full h-[20vh] !sm:w-[48%] !sm:h-[40vh] illu-container p-8 flex flex-col justify-end cursor-pointer"
          @click="registerMode = 'link'"
        >
          <p class="text-white text-md">
            Me connecter à l'aide d'un comtpe existant
          </p>
          <h2 class="font-bold text-white text-xl">Déja passé ?</h2>
        </div>
        <div
          class="w-full h-[20vh] !sm:w-[48%] !sm:h-[40vh] illu-container p-8 flex flex-col justify-end cursor-pointer"
          @click="registerMode = 'register'"
        >
          <p class="text-white text-md un-blur">
            S'inscrire sur midi-friendly dès maintenant
          </p>
          <h2 class="font-bold text-white text-xl">Nouveau ?</h2>
        </div>
      </div>
    </div>
  </template>

  <template v-if="registerMode">
    <div class="flex overflow-hidden">
      <div class="w-0 lg:w-1/2 h-layout illu-container-full"></div>
      <NScrollbar
        class="w-full lg:w-1/2"
        style="max-height: calc(100vh - 4rem)"
      >
        <div class="p-16 flex flex-col gap-8">
          <h1 class="font-600 text-lg">
            Lier l'organisation
            <i>{{ invitation?.invitation.organization.name }}</i>
            a un
            {{
              registerMode === "register"
                ? "nouveau compte"
                : "compte existant"
            }}.
          </h1>
          <p class="text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
            minus tenetur odio quas architecto reprehenderit impedit fuga qui
            quod
          </p>
          <Transition name="slide-fade" mode="out-in">
            <component
              :is="registerMode === 'register' ? RegisterForm : LoginForm"
              @on-submit="FinaliseRegisterProcess"
            />
          </Transition>
          <NDivider class="!m-0" />
          <div class="flex w-full justify-center">
            <NButton
              text
              @click="
                registerMode = registerMode === 'link' ? 'register' : 'link'
              "
            >
              <span v-if="registerMode === 'register'">
                Vous avez déja un compte ?
              </span>
              <span v-else>Pas de compte ? Créez-en un</span>
            </NButton>
          </div>
        </div>
      </NScrollbar>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.illu-container {
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.673)),
    url("@/assets/images/invitation/link.png") no-repeat;
  background-size: cover;
  transition: all ease-in-out 0.2s;
  background-blend-mode: darken, luminosity;
  &:hover {
    filter: brightness(1.25);
  }
}

.illu-container-full {
  background: url("@/assets/images/invitationIllu.png") no-repeat;
  background-size: cover;
}
</style>
