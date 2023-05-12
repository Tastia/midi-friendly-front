import { ManagerOptions, SocketOptions, io } from "socket.io-client";

export function useSocketClient(url: string, options: Partial<ManagerOptions & SocketOptions>) {
  const userStore = useUserStore();
  const isConnected = ref(false);
  const client = io(`${import.meta.env.VITE_GATEWAY_URL}/chat` as string, {
    forceNew: true,
    autoConnect: false,
    auth: (callback) =>
      callback({
        accessToken: userStore.accessToken,
        organizationId: userStore.activeOrganization?._id,
      }),
  });

  client.on("connect", () => (isConnected.value = true));
  client.on("disconnect", () => (isConnected.value = false));

  const { isOnline } = useNetwork();

  watch(isOnline, (isOnline) => (isOnline ? client.disconnect().connect() : client.disconnect()));

  client.timeout;

  return { client, isConnected };
}
