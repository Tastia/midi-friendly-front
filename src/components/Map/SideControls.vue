<script setup lang="ts">
import { useFormApi } from "@chronicstone/vue-sweettools";
import { CustomControl } from "vue3-google-map";

const formApi = useFormApi();

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
