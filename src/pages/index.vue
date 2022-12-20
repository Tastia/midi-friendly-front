<script setup lang="ts">
definePageMeta({
  name: "home",
  showLogin: true,
  noBodyPadding: true,
});
</script>

<template>
  <div class="flex flex-col gap-0">
    <LandingSection>
      <div class="flex flex-col gap-12.5 w-[45%]">
        <h1 class="text-[46px] font-black">
          Enfin un moyen pour vous et vos collègues de
          <span class="text-primary">trouver à manger</span>
        </h1>

        <div class="flex gap-4">
          <NButton type="primary" size="large">
            Détails de la réservation
          </NButton>

          <NButton size="large"> Détails de la réservation </NButton>
        </div>
      </div>

      <NuxtImg src="/landing/illu1.png" height="369" width="500" />
    </LandingSection>

    <LandingSection inverted>
      <NuxtImg src="/landing/illu2.png" height="369" width="500" />

      <div class="flex flex-col gap-12.5 w-[45%]">
        <h2 class="text-[32px] font-black">A propos de Midi Friendly</h2>

        <p class="text-black/50 text-sm">
          Le moment le plus important d’une journée de travail n’est pas la
          réunion, mais bien le déjeuner. Echanger, intégrer et rigoler, c’est
          la période à privilégier pour vous et votre entreprise. Fini la prise
          de tête à demander où manger, MidiFriendly
        </p>
      </div>
    </LandingSection>
  </div>
</template>
