<script setup lang="ts">
import { AuthEmailCredentials, AuthLoginDto, AuthProviderCredentials, AuthRegisterDto } from "@/types/auth";
import { useFormController } from "@chronicstone/vue-sweettools";
import { buildFormSchema, FormRenderer, FormRefInstance } from "@chronicstone/vue-sweettools";

const emit = defineEmits<{ (e: "onSubmit", data: AuthLoginDto): void }>();

const formSchema = buildFormSchema({
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
});

const formRef = ref<FormRefInstance>();
const { formData } = useFormController(formRef, formSchema);

function SubmitFormData(
  type: AuthLoginDto["type"],
  data: Omit<AuthEmailCredentials, "type"> | Omit<AuthRegisterDto, "type">
) {
  emit("onSubmit", { type, ...data } as AuthLoginDto);
}

watchEffect(() => {
  console.log(formData.value);
});
</script>

<template>
  <div class="flex flex-col">
    <FormRenderer :schema="formSchema" />
    <NButton class="w-full" size="large" secondary type="primary" @click="SubmitFormData('email', formData)">
      CONNEXION
    </NButton>
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
