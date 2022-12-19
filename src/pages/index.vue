<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "active-organization"],
});

const userStore = useUserStore();
</script>

<template>
  <MapInteractiveMap
    v-if="userStore.activeOrganization"
    :key="userStore.activeOrganization._id"
    :orga-coordinates="userStore.activeOrganization.coordinates"
  />
  <div v-else>No orga selected</div>
</template>
