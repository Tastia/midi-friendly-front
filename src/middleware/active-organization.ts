export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();
  if (!userStore.activeOrganization)
    return navigateTo("/settings/select-organization");
});
