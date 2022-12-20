<script setup lang="ts">
import { Restaurant } from "@/types/restaurant";
import { useSweetform } from "@chronicstone/vue-sweetforms";
import { ParsedMapLunchGroup } from "@/composables/useRestaurantLunchGroups";

const emit = defineEmits<{
  (event: "update:modelValue", val: boolean): void;
}>();
const props = defineProps<{ restaurant: Restaurant; modelValue: boolean }>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { width } = useWindowSize();
const formApi = useSweetform();
const gatewayApi = inject(mapApiInjectionKey);
const userStore = useUserStore();
const lunchGroups = useRestaurantLunchGroups(props.restaurant._id);

const isUserInAGroup = computed<boolean>(() =>
  lunchGroups.value.some((group) =>
    group.users.some((user) => user._id === userStore.user?._id)
  )
);

async function CreateLunchGroup() {
  isOpen.value = false;
  await nextTick();
  const { isCompleted, formData } = await formApi.createForm({
    title: "Créer un groupe",
    maxWidth: "650px",
    fieldSize: 9,
    gridSize: 9,
    allowClickOutside: false,
    fields: [
      {
        label: "Label",
        key: "label",
        type: "text",
        required: true,
        placeholder: "Afterwork IT",
        size: "9 md:6",
      },
      {
        key: "meetingTime",
        label: "Heure de rendez-vous",
        type: "time",
        required: true,
        default: Date.now(),
        size: "9 md:3",
        fieldParams: {
          format: "HH:mm",
          minuteStep: 5,
        },
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: false,
        placeholder: "Description du groupe (optionnel)",
      },
    ],
  });

  isOpen.value = true;
  if (!isCompleted) return;

  gatewayApi?.CreateGroup({
    label: formData.label,
    description: formData.description,
    restaurant: props.restaurant._id,
    meetingTime: new Date(formData.meetingTime).toISOString(),
  });
}

function SortByMeetingTime(groups: ParsedMapLunchGroup[]) {
  return groups.sort((a, b) => {
    const aDate = new Date(a.meetingTime);
    const bDate = new Date(b.meetingTime);

    if (aDate < bDate) return -1;
    if (aDate > bDate) return 1;
    return 0;
  });
}
</script>

<template>
  <NDrawer
    v-model:show="isOpen"
    :z-index="850"
    mask-closable
    :width="width < 580 ? width : 580"
    placement="left"
  >
    <NDrawerContent :native-scrollbar="false" closable :title="restaurant.name">
      <template #header>
        <h1 class="text-2xl font-black">{{ restaurant.name }}</h1>
      </template>
      <div class="flex flex-col gap-6">
        <div class="w-full h-50 rounded bg-gray-400 grid place-items-center">
          IMAGE HERE
        </div>

        <p class="font-black text-lg">Groupes :</p>

        <div v-if="!lunchGroups.length" class="flex justify-center">
          <NEmpty> Aucun groupe disponnible </NEmpty>
        </div>

        <div v-else class="flex flex-col gap-3">
          <MapProfileLunchGroup
            v-for="group in SortByMeetingTime(lunchGroups)"
            :key="group._id"
            :group="group"
          />
        </div>

        <NButton
          size="large"
          type="primary"
          class="uppercase text-md w-full"
          :disabled="isUserInAGroup || !!gatewayApi?.pendingOperation.value"
          :loading="gatewayApi?.pendingOperation.value === 'CreateGroup'"
          @click="CreateLunchGroup"
        >
          <template #icon>
            <i:mdi:plus />
          </template>
          Créer un groupe
        </NButton>

        <span class="text-gray-500 text-sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
          molestias impedit repellat quasi voluptates assumenda.
        </span>

        <p class="whitespace-pre-line">
          <span class="font-semibold">Addresse :</span> 12 avenue Leonard de
          Vinci, 75013 Paris
          <!-- <span>
            {{ restaurant.address.street }} {{ restaurant.address.city }},
            {{ restaurant.address.zip }} {{ restaurant.address.country }}
          </span> -->
        </p>

        <span class="font-semibold">Horaires :</span>
        <NEmpty v-if="!restaurant.openingHours.length">
          Horaires d'ouverture non renseignées
        </NEmpty>
        <div v-else>
          <div
            v-for="(item, index) in restaurant.openingHours"
            :key="index"
            class="w-full flex justify-between gap-2 w-2/3"
          >
            <span>{{ item.split(":")?.[0]?.trim() ?? item }} :</span>
            <span>{{
              item
                .split(":")
                ?.filter((_, i) => i !== 0)
                .join(":")
                ?.trim() ?? ""
            }}</span>
          </div>
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
