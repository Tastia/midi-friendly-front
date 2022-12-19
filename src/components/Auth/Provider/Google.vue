<script setup lang="ts">
import {
  useTokenClient,
  type AuthCodeFlowSuccessResponse,
  type AuthCodeFlowErrorResponse,
} from "vue3-google-signin";
import axios from "axios";
import { AuthRegisterDto } from "@/types/auth";

const emit = defineEmits<{
  (e: "onAuth", data: Omit<AuthRegisterDto, "type">): void;
}>();
const handleOnSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  const { data } = await axios.get(
    "https://people.googleapis.com/v1/people/me",
    {
      headers: { Authorization: `Bearer ${response.access_token}` },
      params: { personFields: "emailAddresses,names,photos,metadata" },
    }
  );

  emit("onAuth", {
    email: data.emailAddresses[0].value,
    firstName: data.names[0].givenName,
    lastName: data.names[0].familyName,
    avatar: data.photos[0].url,
    userId: data.metadata.sources[0].id,
  });
};

const handleOnError = (errorResponse: AuthCodeFlowErrorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});
</script>

<template>
  <NButton :disabled="!isReady" secondary round @click="login">
    <template #icon>
      <i:logos:google-icon />
    </template>
    <slot v-if="$slots.default" />
  </NButton>
</template>
