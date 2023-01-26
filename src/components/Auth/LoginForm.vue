<script setup lang="ts">
import { Form, FormSchema } from "@chronicstone/vue-sweetforms";
import { helpers, sameAs } from "@vuelidate/validators";
import {
  AuthEmailCredentials,
  AuthLoginDto,
  AuthProviderCredentials,
  AuthRegisterDto,
} from "@/types/auth";

const emit = defineEmits<{ (e: "onSubmit", data: AuthLoginDto): void }>();

function SubmitFormData(
  type: AuthLoginDto["type"],
  data: Omit<AuthEmailCredentials, "type"> | Omit<AuthRegisterDto, "type">
) {
  emit("onSubmit", { type, ...data } as AuthLoginDto);
}

const formSchema: FormSchema = {
  gridSize: 8,
  fieldSize: 8,
  fields: [
    {
      label: "Adresse email",
      key: "email",
      type: "text",
      size: 8,
      required: true,
    },
    {
      label: "Mot de passe",
      key: "password",
      type: "password",
      required: true,
    },
  ],
};
</script>

<template>
  <div class="flex flex-col">
    <Form
      :form-options="formSchema"
      @on-submit="SubmitFormData('email', $event)"
    >
      <template #actions="{ toggleSubmit }">
        <NButton
          class="w-full"
          size="large"
          secondary
          type="primary"
          @click="toggleSubmit"
        >
          CONNEXION
        </NButton>
      </template>
    </Form>
    <NDivider>
      <span class="text-sm">OR</span>
    </NDivider>
    <div class="flex justify-center gap-4 items-center">
      <!-- <AuthProviderFacebook /> -->
      <AuthProviderGoogle @on-auth="SubmitFormData('google', $event)">
        Se connecter avec Google
      </AuthProviderGoogle>
      <!-- <AuthProviderLinkedIn /> -->
    </div>
  </div>
</template>
