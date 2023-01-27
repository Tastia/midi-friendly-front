<template>
  <n-el
    class="bg-[var(--body-color)] mt-26 border-t border-[var(--border-color)] w-full"
  >
    <div
      class="w-full mx-auto max-w-screen-xl flex items-center justify-between py-4"
    >
      <p>@MidiFriendly</p>
      <div class="flex gap-4 align-center">
        <nuxt-link
          to="/legal-mentions"
          class="transition-all ease-in-out duration-100 hover:text-primary"
        >
          Mentions légales
        </nuxt-link>
        <nuxt-link
          class="transition-all ease-in-out duration-100 hover:text-primary"
          to="/"
          >Contact</nuxt-link
        >
      </div>
    </div>
  </n-el>
</template>
