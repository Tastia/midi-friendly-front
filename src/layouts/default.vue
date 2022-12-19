<script setup lang="ts">
import { useLoadingBar, useThemeVars } from "naive-ui";

useReactifiedApi();

const route = useRoute();
const themeVars = useThemeVars();
const loadingApi = useLoadingBar();

watch(
  () => route.name,
  () => loadingApi.finish()
);
</script>

<template>
  <n-layout>
    <n-layout-header>
      <LayoutHeader />
    </n-layout-header>
    <n-layout-content
      :content-style="{
        background: themeVars.bodyColor,
        height: 'calc(100vh - 4rem)',
      }"
    >
      <slot />
    </n-layout-content>
  </n-layout>
</template>
