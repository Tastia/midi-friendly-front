<script setup lang="tsx">
import { NAvatar, NBadge, NEl, useThemeVars } from "naive-ui";
import { OnboardingEvents } from "@/types/onboarding";
import { sleep } from "@/utils/other/sleep";
import { OnboardingStep } from "@/modules/onboarding/types/onboardingStep";
import { VOnboardingWrapper } from "@/modules/onboarding/types/onboardingWrapper";
import { onKeyPressed } from "@vueuse/core";

const route = useRoute();
const userStore = useUserStore();
const themeVars = useThemeVars();
const { DispatchOnboardingEvent, SubscribeOnboardingEvent } = useOnboardingEvents();

const onboardingWrapper = ref<VOnboardingWrapper>();

const steps: OnboardingStep[] = [
  {
    attachTo: { element: "#onboarding-start" },
    content: {
      title: "Bienvenue sur Midi Friendly",
      description:
        "C'est votre première visite sur le site. Nous allons vous guider pour vous aider à mieux comprendre le fonctionnement de Midi Friendly",
    },
  },
  {
    attachTo: { element: "#onboarding-start" },
    content: {
      title: "La carte interactive",
      description:
        "Midi Friendly vous permet, par le biais d'une carte interactive, de voir les restaurants autour de votre organisation, et de créer des groupes pour aller manger avec vos collègues.",
    },
  },
  {
    attachTo: { element: "#onboarding-start" },
    content: {
      title: "Votre organisation",
      description: () => (
        <div class="flex flex-col gap-4">
          <div>Votre organisation est représentée sur la carte par le marqueur suivant :</div>
          <NAvatar class="self-center" color={themeVars.value.primaryColor}>
            <span
              class="iconify font-bold text-[50px] text-shadow text-white"
              data-icon="mdi:office-building"
            />
          </NAvatar>
        </div>
      ),
    },
  },
  {
    attachTo: { element: "#onboarding-start" },
    content: {
      title: "Les restaurants",
      description: () => (
        <div class="flex flex-col gap-4">
          <div>Les restaurants sont représentés sur la carte par le marqueur suivant :</div>
          <NAvatar
            class="shadow-sm self-center"
            style={{
              border: `3px solid #d2d2d2`,
            }}
            size={50}
            theme-overrides={{ color: "white" }}
          >
            <span class="iconify font-bold text-lg text-black" data-icon="material-symbols:restaurant" />
          </NAvatar>
          <div>En cliquant sur le marqueur, vous accéderez à la page du restaurant.</div>
        </div>
      ),
    },
  },
  {
    attachTo: { element: "#onboarding-start" },
    content: {
      title: "Les restaurants (2)",
      description: () => (
        <div class="flex flex-col gap-4">
          <div>
            Lorsque des groupes ont été créés pour un restaurant, une pastille indiquant le nombre de groupes
            est affichée sur le marqueur.
          </div>
          <NBadge class="self-center" value={5} color={themeVars.value.primaryColor}>
            <NAvatar
              class="shadow-sm"
              style={{
                border: `3px solid #d2d2d2`,
              }}
              size={50}
              theme-overrides={{ color: "white" }}
            >
              <span class="iconify font-bold text-lg text-black" data-icon="material-symbols:restaurant" />
            </NAvatar>
          </NBadge>
        </div>
      ),
    },
  },
  {
    attachTo: { element: "#onboarding-start" },
    content: {
      title: "Les restaurants (3)",
      description: () => (
        <div class="flex flex-col gap-4">
          <div>
            Si vous appartenez à un des groupes, du restaurant, le marqueur aura l'apparence suivante :
          </div>
          <div class="relative self-center" style="width: fit-content;">
            <NBadge value={5} color={themeVars.value.primaryColor}>
              <NAvatar
                class="shadow-sm self-center"
                style={{
                  border: `3px solid ${themeVars.value.primaryColor}`,
                }}
                size={50}
                theme-overrides={{ color: "white" }}
              >
                <span class="iconify font-bold text-lg text-black" data-icon="material-symbols:restaurant" />
              </NAvatar>
            </NBadge>
            <NEl
              tag="div"
              class="bg-[var(--primary-color)] py-1 px-2 rounded-full text-white dark:text-black active_time_tag text-xs w-[50px]"
            >
              10:30
            </NEl>
          </div>
          <div class="h-2"></div>
        </div>
      ),
    },
    on: {
      afterStep: async () => {
        await DispatchOnboardingEvent(OnboardingEvents.openRestaurantProfile);
        await nextTick();
        await sleep(2000);
      },
    },
  },
  {
    attachTo: { element: "#restaurant-profile-drawer" },
    content: {
      title: "Le profil du restaurant",
      description: () => (
        <div class="flex flex-col gap-4">
          <div>
            En ouvrant les détails du restaurant, vous pourrez accéder à différentes informations, comme les
            horaires d'ouverture, les avis, et les groupes déjà créés par vos collègues.
          </div>
          <div>Vous pouvez voir les informations du restaurant, et les groupes qui y vont manger.</div>
        </div>
      ),
    },
    options: {
      popper: {
        placement: "right",
      },
    },
  },
  {
    attachTo: { element: "#create-group-trigger" },
    content: {
      title: "Créer un groupe (1)",
      description: () => (
        <div class="flex flex-col gap-4">
          <div>
            En cliquant sur ce bouton, vous pouvez créer un groupe pour aller manger avec vos collègues.
          </div>
        </div>
      ),
    },
  },
  {
    attachTo: { element: "#sweetforms__form" },
    content: {
      title: "Créer un groupe (2)",
      description: () =>
        "Le formulaire de création de groupe est très simple. Une fois envoyé, le groupe sera créé et instantanément disponible pour les autres utilisateurs.",
    },
    on: {
      beforeStep: async () => {
        await DispatchOnboardingEvent(OnboardingEvents.closeRestaurantProfile);
        await DispatchOnboardingEvent(OnboardingEvents.openCreateGroupForm);
        await sleep(100);
        await nextTick();
      },
    },
  },
  {
    attachTo: { element: "#user-menu-trigger" },
    content: {
      title: "Liste des utilisateurs",
      description:
        "En cliquant sur ce bouton, vous pouvez voir la liste des utilisateurs appartenant à votre organisation",
    },
    on: {
      beforeStep: async () => {
        await DispatchOnboardingEvent(OnboardingEvents.closeCreateGroupForm);
        await sleep(100);
        await nextTick();
      },
    },
  },
  {
    attachTo: { element: "#user-menu-drawer" },
    content: {
      title: "Liste des utilisateurs",
      description: "En ouvrant le menu, vous verrez qui est connecté et qui ne l'est pas",
    },
    on: {
      beforeStep: async () => {
        await DispatchOnboardingEvent(OnboardingEvents.openUserMenu);
      },
      afterStep: async () => {
        await DispatchOnboardingEvent(OnboardingEvents.closeUserMenu);
      },
    },
    options: {
      popper: {
        placement: "left",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [100, 50],
            },
          },
        ],
      },
    },
  },
  {
    attachTo: { element: "#group-menu-trigger" },
    content: {
      title: "Vos groupes actifs",
      description:
        "En cliquant sur ce bouton, vous pouvez voir la liste des groupes actifs auxquels vous appartenez.",
    },
  },
  {
    attachTo: { element: "#poll-menu-trigger" },
    content: {
      title: "Sondages de groupe (1)",
      description: () => (
        <div class="flex flex-col gap-2">
          <span>Ce menu vous permet d'accéder au menu de gestion des sondages de groupe.</span>

          <span>
            Les sondages de groupe permettent d'initier un vote sur le restaurant où vous allez manger.
          </span>
        </div>
      ),
    },
  },
  {
    attachTo: { element: "#poll-menu-drawer" },
    content: {
      title: "Sondages de groupe (2)",
      description: () => (
        <div class="flex flex-col gap-2">
          <span>En ouvrant le menu, vous pouvez voir les sondages de groupe auxquels vous participez.</span>

          <span>
            Vous pouvez voir les sondages de groupe actifs, et voter pour le restaurant de votre choix.
          </span>

          <span>
            Pour chaque groupe, vous verrez le temps restant avant la fin du sondage, les participants, et la
            répartition des votes existants.
          </span>
        </div>
      ),
    },
    on: {
      beforeStep: async () => {
        await DispatchOnboardingEvent(OnboardingEvents.openPollMenu);
        await nextTick();
      },
    },
    options: {
      popper: {
        placement: "left",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [100, 50],
            },
          },
        ],
      },
    },
  },
];

const cancelSubscription = SubscribeOnboardingEvent(
  (event: OnboardingEvents) =>
    event === OnboardingEvents.startOnboarding && onboardingWrapper.value?.StartOnboarding()
) as () => void;

async function ConfirmExitOnboarding() {
  if (!onboardingWrapper.value || !onboardingWrapper.value.isRunning) return;

  onboardingWrapper.value.FinishOnboarding();
  await nextTick();
  const proceed = await useConfirmDialog({
    type: "warning",
    title: "Quitter l'introduction ?",
    content: "Vous pourrez toujours la relancer depuis le boutton présent dans la barre de navigation.",
    positiveText: "Oui",
    negativeText: "Non",
    style: "z-index: 20000;",
  });
  if (proceed) userStore.SetOnboardingCompleted();
  else onboardingWrapper.value.StartOnboarding();
}

onUnmounted(cancelSubscription);
onKeyStroke("Escape", ConfirmExitOnboarding);
</script>

<template>
  <VOnboarding ref="onboardingWrapper" :steps="steps" @completed="userStore.SetOnboardingCompleted()" />
</template>
