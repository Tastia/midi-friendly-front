import { generateUUID } from "@/utils/generator/uuid";
export function useEventDispatcher<
  T extends (...args: any[]) => any | Promise<(...args: any[]) => any>
>() {
  const subscribers = shallowRef<{ _id: string; handler: T }[]>([]);

  function removeSubscriber(id: string) {
    subscribers.value = subscribers.value.filter((s) => s._id !== id);
  }

  function subscribe(handler: T): () => void {
    const _id = generateUUID();
    subscribers.value.push({ _id, handler });
    return () => removeSubscriber(_id);
  }

  async function dispatch(...args: Parameters<T>) {
    return Promise.all(subscribers.value.map((s) => s.handler(...args)));
  }

  return [subscribe, dispatch];
}
