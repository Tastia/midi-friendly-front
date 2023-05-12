<script setup lang="ts">
import { CollectUserSatisfaction } from "~~/src/services/user.jsx";
</script>

<template>
  <NButton type="primary" class="side-button" @click="CollectUserSatisfaction"> Votre avis </NButton>
</template>

<style lang="scss" scoped>
.side-button {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 500;
  transform: rotate(-90deg) translateY(calc(50% + 8px));
}
</style>
