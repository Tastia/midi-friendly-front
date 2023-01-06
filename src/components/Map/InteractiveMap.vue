<script setup lang="ts">
import { useSweetform } from "@chronicstone/vue-sweetforms";
import { GoogleMap } from "vue3-google-map";
import { OnboardingEvents } from "@/types/onboarding";

definePageMeta({
  middleware: ["auth"],
});

const props = withDefaults(
  defineProps<{
    zoom?: number;
    orgaCoordinates: { latitude: number; longitude: number };
    boundaries: { latitude: number; longitude: number };
  }>(),
  {
    zoom: 17,
    boundaries: () => ({
      latitude: 0.004,
      longitude: 0.008,
    }),
  }
);
const formApi = useSweetform();
const appStore = useAppStore();
const mapGatewayApi = useMapGateway();
provide(mapApiInjectionKey, mapGatewayApi);

const GApiKey = import.meta.env.VITE_GOOGLE_API_KEY as string;
const computedBoundaries = computed(() => ({
  north: props.orgaCoordinates.latitude + props.boundaries.latitude,
  south: props.orgaCoordinates.latitude - props.boundaries.latitude,
  east: props.orgaCoordinates.longitude + props.boundaries.longitude,
  west: props.orgaCoordinates.longitude - props.boundaries.longitude,
}));

const mapStylesConfig = computed(() => [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  ...(appStore.isDark ? [...GMapsThemeOverridesDark] : []),
]);

const { SubscribeOnboardingEvent } = useOnboardingEvents();
const cancelSubscription = SubscribeOnboardingEvent(
  (event: OnboardingEvents) => {
    if (event === OnboardingEvents.openCreateGroupForm)
      formApi.createForm(LunchGroupFormSchema());

    if (event === OnboardingEvents.closeCreateGroupForm)
      (
        document.querySelector(
          "#sweetforms__form > div.n-card__footer > div > button.n-button.n-button--error-type.n-button--medium-type.n-button--secondary"
        ) as HTMLButtonElement
      )?.click();
  }
) as () => void;
onUnmounted(() => cancelSubscription());
</script>

<template>
  <GoogleMap
    :api-key="GApiKey"
    class="h-layout w-screen"
    :center="{
      lat: orgaCoordinates.latitude,
      lng: orgaCoordinates.longitude,
    }"
    :styles="mapStylesConfig"
    :zoom="zoom"
    :clickable-icons="false"
    :restriction="{ latLngBounds: computedBoundaries }"
    disable-default-ui
  >
    <MapMarkerOrganization :position="orgaCoordinates" />
    <MapMarkerRestaurant
      v-for="(restaurant, index) in mapGatewayApi.restaurants.value"
      :key="restaurant._id"
      :restaurant="restaurant"
      :index="index"
    />
    <MapSideControls />
  </GoogleMap>
</template>
