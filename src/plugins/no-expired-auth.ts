import JwtDecode from "jwt-decode";

export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    "no-expired-auth",
    () => {
      const userStore = useUserStore();
      if (userStore.accessToken) {
        const decodedToken = JwtDecode<{ exp: number }>(
          userStore.accessToken as string
        );
        if (decodedToken?.exp < Date.now() / 1000) userStore.ClearUserSession();
      }
    },
    { global: true }
  );
});
