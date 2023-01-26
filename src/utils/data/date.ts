export function getFutureDate(offset: number, roundTo = 5) {
  const date = new Date();
  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / roundTo) * roundTo;
  date.setMinutes(roundedMinutes + offset);
  return date;
}
