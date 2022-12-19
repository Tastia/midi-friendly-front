export function isMounted() {
  const isMounted = ref(false);
  onMounted(() => {
    isMounted.value = true;
  });

  return isMounted;
}
