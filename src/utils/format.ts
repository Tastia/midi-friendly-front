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
export const getUserInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
export const formatRelativeDate = (val: string) => dayjs(val).fromNow();
export const getTimeDiff = (
  deadline: string,
  start?: string,
  percent?: boolean
) => {
  const deadlineDate = new Date(deadline);
  const startDate = new Date(start ?? new Date());
  const currentDate = new Date();

  if (percent) {
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    const totalTime = deadlineDate.getTime() - startDate.getTime();
    const percentage = (timeDifference / totalTime) * 100;
    return percentage < 0 ? 0 : +percentage.toFixed(2);
  } else {
    const timeDifference = deadlineDate.getTime() - startDate.getTime();
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return (
      (hours < 10 ? "0" : "") +
      (hours < 0 ? "0" : hours) +
      ":" +
      (minutes < 10 ? "0" : "") +
      (minutes < 0 ? "0" : minutes) +
      ":" +
      (seconds < 10 ? "0" : "") +
      (seconds < 0 ? "0" : seconds)
    );
  }
};
