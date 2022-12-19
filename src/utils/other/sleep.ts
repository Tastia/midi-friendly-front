export const sleep = async (ms: number) =>
  setTimeout(() => Promise.resolve(), ms);
