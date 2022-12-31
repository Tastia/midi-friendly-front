<script setup lang="ts">
import { CustomMarker } from "vue3-google-map";
import { NBadge, useThemeVars } from "naive-ui";
import { Restaurant } from "@/types/restaurant";
import { OnboardingEvents } from "@/types/onboarding";

const props = defineProps<{ restaurant: Restaurant; index: number }>();

const userStore = useUserStore();
const themeVars = useThemeVars();
const showProfile = ref<boolean>(false);

const lunchGroups = useRestaurantLunchGroups(props.restaurant._id);
const userLunchGroup = computed(() =>
  lunchGroups.value.find((group) =>
    group.users.some((user) => user._id === userStore.user?._id)
  )
);

const { SubscribeOnboardingEvent } = useOnboardingEvents();
const cancelSubscription = SubscribeOnboardingEvent(
  (event: OnboardingEvents) => {
    if (event === OnboardingEvents.openRestaurantProfile && props.index === 0)
      showProfile.value = true;
    if (event === OnboardingEvents.closeRestaurantProfile && props.index === 0)
      showProfile.value = false;
  }
) as () => void;
onUnmounted(() => cancelSubscription());
</script>

<template>
  <CustomMarker
    :options="{
      position: {
        lat: restaurant.coordinates.latitude,
        lng: restaurant.coordinates.longitude,
      },
      anchorPoint: 'BOTTOM_CENTER',
    }"
  >
    <NTooltip>
      <div class="flex flex-col items-center">
        <span>{{ restaurant.name }}</span>
        <span class="text-xs text-gray-400">
          {{ lunchGroups.length }} groupe{{ lunchGroups.length > 1 ? "s" : "" }}
        </span>
      </div>
      <template #trigger>
        <div class="relative !cursor-pointer" @click="showProfile = true">
          <component
            :is="lunchGroups.length > 0 ? NBadge : 'div'"
            type="warning"
            :value="lunchGroups.length"
          >
            <NAvatar
              class="shadow-sm"
              :style="{
                border: `3px solid ${
                  userLunchGroup ? themeVars.primaryColor : '#d2d2d2'
                }`,
              }"
              :size="50"
              :theme-overrides="{ color: 'white' }"
            >
              <i:material-symbols:restaurant
                class="font-bold text-lg text-black"
              />
            </NAvatar>
          </component>

          <NEl
            v-if="userLunchGroup"
            tag="div"
            class="bg-[var(--primary-color)] py-1 px-2 rounded-full text-white dark:text-black w-[fit-content] active_time_tag"
          >
            {{ formatTimeFromTimestamp(userLunchGroup.meetingTime) }}
          </NEl>
        </div>
      </template>
    </NTooltip>
  </CustomMarker>

  <MapProfileRestaurant v-model="showProfile" :restaurant="restaurant" />
</template>

<style lang="scss">
.active_time_tag {
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translate(50%, -50%);
}
</style>
