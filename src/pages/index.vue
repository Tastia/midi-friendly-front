<template>
  <div
    id="first-section"
    class="flex overflow-hidden p-18 gap-12 h-4/5 items-center"
  >
    <div class="w-full lg:w-1/2 flex flex-col gap-8">
      <h1 class="font-600 text-5xl">Enfin un moyen pour vous et vos collègues de <span class="text-primary">trouver à manger</span></h1>
      <div class="flex gap-4">
        <NButton type="primary">Détails de la réservation</NButton>
        <NButton type="secondary">Détails de la réservation</NButton>
      </div>
    </div>
    <div class="w-full h-5/6 lg:w-1/2 image-container rounded-md"></div>
  </div>

  <div id="about" class="flex overflow-hidden p-18 gap-12 h-4/5 items-center">
    <div class="w-full h-5/6 lg:w-1/2 image-container rounded-md"></div>
    <div class="w-full lg:w-1/2 flex flex-col gap-8">
      <h2 class="font-600 text-3xl">A propos de MidiFriendly</h2>
      <p>Le moment le plus important d’une journée de travail n’est pas la réunion, mais bien le déjeuner. Echanger, intégrer et rigoler, c’est la période à privilégier pour vous et votre entreprise. Fini la prise de tête à demander où manger, MidiFriendly.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#first-section {
  .image-container {
    background: url("@/assets/images/homepage/midi-friendly-group.jpg") no-repeat;
    background-size: cover;
    background-position: center;
  }
}
#about {
  .image-container {
    background: url("@/assets/images/homepage/about.jpg") no-repeat;
    background-size: cover;
    background-position: center;
  }
}
</style>
