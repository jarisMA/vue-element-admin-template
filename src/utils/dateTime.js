const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${[year, month, day].map(formatNumber).join("-")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join("-");
};

const formatUTC = (date) => {
  const T_pos = date.indexOf("T");
  const Z_pos = date.indexOf("Z");
  const year_month_day = date.substr(0, T_pos);
  const hour_minute_second = date.substr(T_pos + 1, Z_pos - T_pos - 1);
  const new_datetime = `${year_month_day} ${hour_minute_second}`;

  // 处理成为时间戳
  timestamp = new Date(Date.parse(new_datetime));
  timestamp = timestamp.getTime();
  timestamp /= 1000;

  // 增加8个小时，北京时间比utc时间多八个时区
  var timestamp = timestamp + 8 * 60 * 60;

  // 时间戳转为时间
  const beijing_datetime = new Date(parseInt(timestamp) * 1000)
    .toLocaleString()
    .replace(/年|月/g, "-")
    .replace(/日/g, " ");
  return beijing_datetime;
};

export { formatTime, formatDate, formatUTC };
