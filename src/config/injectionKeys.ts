import { InjectionKey } from "vue";

export const mapApiInjectionKey: InjectionKey<ReturnType<typeof useMapGateway>> =
  Symbol("mapApiInjectionKey");

export const chatApiInjectionKey: InjectionKey<ReturnType<typeof useChatGateway>> =
  Symbol("chatApiInjectionKey");
