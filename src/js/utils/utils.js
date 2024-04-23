function getLastTime(dateString) {
  const date = new Date(dateString);
  //   return date;
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const diffSec = diffMs / 1000;
  const diffMin = diffSec / 60;
  const diffHour = diffMin / 60;
  const diffDay = diffHour / 24;
  const diffMonth = diffDay / 30;
  const diffYear = diffDay / 365;

  // Xác định đơn vị thời gian phù hợp để trả về
  if (diffMin < 60) {
    `${Math.floor(diffMin)} phút trước`;
  } else if (diffHour < 24) {
    return `${Math.floor(diffHour)} giờ trước`;
  } else if (diffDay < 30) {
    return `${Math.floor(diffDay)} ngày trước`;
  } else if (diffMonth < 12) {
    return `${Math.floor(diffMonth)} tháng trước`;
  } else {
    return `${Math.floor(diffYear)} năm trước`;
  }
}

export { getLastTime };
