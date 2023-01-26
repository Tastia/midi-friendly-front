<script setup lang="ts">
import { useSweetform } from "@chronicstone/vue-sweetforms";
import { CustomControl } from "vue3-google-map";

const formApi = useSweetform();

function GetForm() {
  formApi.createForm(LunchGroupPollFormSchema());
}
</script>

<template>
  <CustomControl position="RIGHT_TOP">
    <div class="flex flex-col gap-2 p-4">
      <MapControlUserMenu />
      <MapControlGroupMenu />
      <MapControlPollMenu />
    </div>
  </CustomControl>
</template>
