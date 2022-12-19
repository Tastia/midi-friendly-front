import { InjectionKey } from "vue";

export const mapApiInjectionKey: InjectionKey<
  ReturnType<typeof useMapGateway>
> = Symbol("mapApiInjectionKey");
