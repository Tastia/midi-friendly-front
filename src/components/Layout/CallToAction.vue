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
  <div class="call-to-action mt-20 lg:mt-0">
    <div
      class="flex bg-slate-100 dark:bg-[#353535] border border-black/10 rounded-md relative overflow-hidden"
    >
      <div class="flex flex-col w-full !lg:w-3/5 gap-5 p-8">
        <h2 class="font-600 text-3xl">{{ title }}</h2>
        <p>{{ description }}</p>
        <a href="mailto:pro.tastia@gmail.com">
          <NButton type="primary" class="w-min">{{ cta }}</NButton>
        </a>
      </div>
      <div class="absolute -right-10 top-10 hidden lg:block">
        <nuxt-img :src="'/' + image" width="450" />
      </div>
    </div>
  </div>
</template>
