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
    image: "/homepage/favoris.jpg",
  },
  {
    title: "Groupes",
    content:
      "MidiFriendly est un outil fait pour se regrouper entre collègues. La rencontre et le partage sont les valeurs que nous voulons partager.",
    image: "/homepage/group.jpg",
  },
  {
    title: "Organisation",
    content:
      "Vous cherchez chaque jour vers quel restaurant se tourner ? Ajouter ses restaurants favoris et pouvoir, d’un coup d’oeil, connaître les goûts de chacun.",
    image: "/homepage/organisation.jpg",
  },
  {
    title: "Canal d’entreprise",
    content:
      "MidiFriendly est un outil fait pour se regrouper entre collègues. La rencontre et le partage sont les valeurs que nous voulons partager.",
    image: "/homepage/canal_entreprise.jpg",
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
  <div class="max-w-screen-xl w-full p-8 mx-auto h-full text-base">
    <div
      id="first-section"
      class="flex overflow-hidden gap-6 md:gap-12 md:h-4/5 flex-col-reverse !md:flex-row items-center"
    >
      <div class="w-full !md:w-1/2 flex flex-col gap-8">
        <h1 class="font-600 text-4xl lg:text-5xl">
          Enfin un moyen pour vous et vos collègues de
          <span class="text-primary">trouver à manger</span>
        </h1>
        <div class="flex gap-4 !sm:flex-row flex-col">
          <router-link to="/auth/login">
            <NButton type="primary" class="text-base">Connexion</NButton>
          </router-link>
          <a href="mailto:pro.tastia@gmail.com">
            <NButton class="text-base">Nous contacter</NButton>
          </a>
        </div>
      </div>
      <img
        src="/homepage/midi-friendly-group.jpg"
        alt="miudi roupe"
        class="w-full !md:w-1/2 max-h-60 !md:max-h-4/6 object-cover rounded-md"
      />
    </div>

    <div
      id="about"
      class="flex overflow-hidden flex-col-reverse !md:flex-row gap-12 md:h-4/5 items-center"
    >
      <img
        src="/homepage/midi-friendly-group.jpg"
        alt="miudi roupe"
        class="w-full !md:w-1/2 max-h-80 !md:max-h-4/6 object-cover rounded-md"
      />
      <div class="w-full !md:w-1/2 flex flex-col gap-8 mt-20 md:mt-0">
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
      class="flex overflow-hidden flex-col !md:flex-row gap-12 md:h-4/5 items-center"
    >
      <div class="w-full !md:w-1/2 flex flex-col gap-8 mt-20 md:mt-0">
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

      <img
        :src="
          collapsibleSectionTexts?.[activeCollapsibleSection ?? -1]?.image ??
          collapsibleSectionTexts[0].image
        "
        alt="miudi roupe"
        class="w-full !md:w-1/2 max-h-60 !md:max-h-4/6 object-cover rounded-md"
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
