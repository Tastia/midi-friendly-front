<script setup lang="ts">
import { map } from "lodash";
import { GoogleMap } from "vue3-google-map";

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

const mapStylesConfig = computed(() => ([ 
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  ...(appStore.isDark ? [...GMapsThemeOverridesDark] : [])
]));
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
      v-for="restaurant in mapGatewayApi.restaurants.value"
      :key="restaurant._id"
      :restaurant="restaurant"
    />
    <MapSideControls />
  </GoogleMap>
</template>
