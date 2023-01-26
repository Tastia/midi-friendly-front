<script lang="ts">
export default {
  props: {
    title: String,
    description: String,
    cta: String,
    image: String,
  },
};
</script>

<template>
  <div class="call-to-action">
    <div
      class="flex bg-slate-100 dark:bg-[#353535] border border-black/10 rounded-md relative overflow-hidden"
    >
      <div class="flex flex-col w-3/5 gap-5 p-8">
        <h2 class="font-600 text-3xl">{{ title }}</h2>
        <p>{{ description }}</p>
        <NButton type="primary" class="w-min">{{ cta }}</NButton>
      </div>
      <div class="absolute -right-10 top-10">
        <n-image
          width="450"
          :src="'http://localhost:3000/_nuxt/assets/images/'+image"
          preview-disabled
        />
      </div>
    </div>
  </div>
</template>
