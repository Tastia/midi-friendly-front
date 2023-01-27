<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  showLogin: true,
});

const collapsibleRefs =
  ref<Array<{ setExpanded: (value: boolean) => void; isExpanded: boolean }>>();
const activeCollapsibleSection = computed(
  () =>
    collapsibleRefs.value?.findIndex((itemRef) => itemRef.isExpanded) ?? null
);
const collapsibleSectionTexts = [
  {
    title: "Favoris",
    content:
      "Vous cherchez chaque jour vers quel restaurant se tourner ? Ajouter ses restaurants favoris et pouvoir, d’un coup d’oeil, connaître les goûts de chacun.",
  },
  {
    title: "Groupes",
    content:
      "MidiFriendly est un outil fait pour se regrouper entre collègues. La rencontre et le partage sont les valeurs que nous voulons partager.",
  },
  {
    title: "Organisation",
    content:
      "Vous cherchez chaque jour vers quel restaurant se tourner ? Ajouter ses restaurants favoris et pouvoir, d’un coup d’oeil, connaître les goûts de chacun.",
  },
  {
    title: "Canal d’entreprise",
    content:
      "MidiFriendly est un outil fait pour se regrouper entre collègues. La rencontre et le partage sont les valeurs que nous voulons partager.",
  },
];

function CollapseNonActiveSections(openedIndex: number) {
  for (const [index, section] of collapsibleRefs.value?.entries() ?? []) {
    if (index === openedIndex) continue;
    section.setExpanded(false);
  }
}
</script>

<template>
  <div class="max-w-screen-xl w-full p-8 mx-auto h-full">
    <div
      id="first-section"
      class="flex overflow-hidden gap-12 lg:h-4/5 flex-col !lg:flex-row items-center"
    >
      <div class="w-full lg:w-1/2 flex flex-col gap-8">
        <h1 class="font-600 text-5xl text-center !lg:text-left">
          Enfin un moyen pour vous et vos collègues de
          <span class="text-primary">trouver à manger</span>
        </h1>
        <div class="flex gap-4 justify-center !lg:justify-start">
          <NButton type="primary">Détails de la réservation</NButton>
          <NButton>Détails de la réservation</NButton>
        </div>
      </div>
      <nuxt-img
        class="rounded-md"
        src="/homepage/midi-friendly-group.jpg"
        sizes="sm:100vw lg:80vw xl:50vw"
        height="400"
      />
    </div>

    <div
      id="about"
      class="flex overflow-hidden flex-col !lg:flex-row gap-12 h-4/5 items-center"
    >
      <nuxt-img
        class="rounded-md order-2 lg:order-1"
        src="/homepage/midi-friendly-group.jpg"
        sizes="sm:100vw lg:80vw xl:50vw"
        height="400"
      />
      <div
        class="w-full lg:w-1/2 flex flex-col gap-8 text-center lg:text-left mt-20 lg:mt-0"
      >
        <h2 class="font-600 text-3xl">A propos de MidiFriendly</h2>
        <p>
          Le moment le plus important d’une journée de travail n’est pas la
          réunion, mais bien le déjeuner. Echanger, intégrer et rigoler, c’est
          la période à privilégier pour vous et votre entreprise. Fini la prise
          de tête à demander où manger, MidiFriendly.
        </p>
      </div>
    </div>

    <div
      id="manage"
      class="flex overflow-hidden flex-col !lg:flex-row gap-12 h-4/5 items-center"
    >
      <div
        class="w-full lg:w-1/2 flex flex-col gap-8 text-center lg:text-left mt-20 lg:mt-0"
      >
        <h2 class="font-600 text-3xl">Un outil de gestion</h2>
        <div class="flex flex-col gap-4">
          <LayoutCollapsibleText
            v-for="(item, index) in collapsibleSectionTexts"
            :key="index"
            ref="collapsibleRefs"
            :default-state="index === 0"
            @expand="CollapseNonActiveSections(index)"
          >
            <template #title>{{ item.title }}</template>
            {{ item.content }}
          </LayoutCollapsibleText>
        </div>
      </div>
      <nuxt-img
        class="w-1/2 h-4/6 rounded-md"
        src="/homepage/organisation.jpg"
        sizes="sm:100vw lg:80vw xl:50vw"
        height="400"
      />
    </div>

    <LayoutCallToAction
      title="Rejoindre MidiFriendly"
      description="Le moment le plus important d’une journée de travail n’est pas la réunion, mais bien le déjeuner. Echanger,
      intégrer et rigoler, c’est la période à privilégier pour vous et votre entreprise. Fini la prise de tête à
      demander où manger, MidiFriendly"
      cta="Demander une démo"
      image="homepage/join-us.png"
    />

    <LayoutFooter />
  </div>
</template>
