import axios, { AxiosError, AxiosResponse } from "axios";

export const ApiInstance = axios.create({
  baseURL: `${
    import.meta.env?.VITE_API_URL ?? "http://localhost:3333"
  }` as string,
});

ApiInstance.interceptors.request.use((config) => {
  const userStore = useUserStore();
  config.headers = {
    ...config.headers,
    "x-application": "client",
    ...((userStore.accessToken && {
      Authorization: `Bearer ${userStore.accessToken}`,
    }) as any),
    ...(userStore.activeOrganization && {
      organizationId: userStore.activeOrganization._id,
    }),
  };
  return config;
});

ApiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { messageApi } = useReactifiedApi();
    if (error.config?.url === "/auth/login" && error.response?.status === 401) {
      messageApi.error("Identifiants incorrects, vérifiez vos informations");
    } else if ((error.response?.data as { message: string })?.message) {
      const rawMsg = (error.response?.data as { message: string })?.message;
      if (Array.isArray(rawMsg))
        for (const msg of rawMsg) messageApi.error(msg);
      else messageApi.error(rawMsg);
    }
    return Promise.reject(error);
  }
);
