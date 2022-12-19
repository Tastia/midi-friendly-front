import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const formatKey = (val: string) =>
  val?.charAt(0).toUpperCase() +
    val
      ?.split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase()
      .slice(1)
      .split("_")
      .join(" ") ?? "";
export const formatDate = (val: string) => dayjs(val).format("MMM DD, YYYY");
export const formatDateTime = (val: string | number) =>
  dayjs(val).format("MMM DD, YYYY hh:mm");
export const formatDateToTimestamp = (val: string) => dayjs(val).valueOf();
export const formatDateToISOstring = (val: string) =>
  dayjs(val).toISOString().toString().replaceAll("Z", "");
export const formatTime = (val: string | number) =>
  dayjs.duration(+val * 1000).format("mm:ss");
export const formatTimeFromTimestamp = (val: string | number) =>
  dayjs(val).format("HH:mm");
export const formatTimeFromNow = (val: string | number) =>
  dayjs(val).fromNow(true);
export const trim = (val: number | string, decimals = 2) =>
  (+val).toFixed(decimals);
export const formatPhoneNumber = (val: string) =>
  val.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
export const convertSecToMin = (val: number) =>
  `${Math.floor(val / 60)}:${val % 60 < 10 ? "0" : ""}${val % 60}`;
export const capitalize = (val: string) =>
  val.charAt(0).toUpperCase() + val.slice(1);
export const formatNullableText = (val: string | null | undefined) =>
  val?.toString() ?? "N/A";
export const decapitalize = (val: string) =>
  val.charAt(0).toLowerCase() + val.slice(1);
export const ExtractFromParenthesis = (string: string) => {
  const regex = /\((.*?)\)/;
  const matches = regex.exec(string);
  return matches?.[1] ?? "";
};
