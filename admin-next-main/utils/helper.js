import moment from "moment";

export const idrNumber = (num) => {
  return Number(num).toLocaleString("id-ID");
};

export const randId = () => {
  return Math.random().toString(32).substring(2, 9);
};

const countDiff = (timeSeconds) => {
  let duration = moment.duration(timeSeconds, "seconds");
  let weeks = duration.get("weeks");
  let days = duration.get("days");
  let hours = duration.get("hours");
  let minutes = duration.get("minutes");
  let result = "";

  if (!isNaN(weeks) && weeks > 0) {
    result += `${weeks} Minggu `;
  }

  if (!isNaN(days) && days > 0) {
    result += `${days} Hari `;
  }

  if (!isNaN(hours) && hours > 0) {
    result += `${hours} Jam `;
  }

  if (!isNaN(minutes) && minutes > 0) {
    result += `${minutes} Menit`;
  }

  return result ? result : "-";
};

export const getTimeDiff = (start, end) => {
  let timeSeconds = moment(end).diff(moment(start), "seconds");
  return countDiff(timeSeconds);
};

export const getTimeDuration = (seconds) => {
  return countDiff(seconds);
};
