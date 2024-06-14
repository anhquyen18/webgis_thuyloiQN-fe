function getLastTime(dateString) {
  const date = new Date(dateString);

  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const diffSec = diffMs / 1000;
  const diffMin = diffSec / 60;
  const diffHour = diffMin / 60;
  const diffDay = diffHour / 24;
  const diffMonth = diffDay / 30;
  const diffYear = diffDay / 365;

  // Xác định đơn vị thời gian phù hợp để trả về
  // console.log(diffSec);
  if (diffSec < 60) {
    return `Bây giờ`;
  } else if (diffMin < 60) {
    return `${Math.floor(diffMin)} phút trước`;
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

function addLeadingZero(number) {
  return number < 10 ? '0' + number : number;
}

function getVnTime(dateString) {
  const date = new Date(dateString);
  // Lấy thông tin ngày, tháng và năm
  var day = addLeadingZero(date.getDate());
  var month = addLeadingZero(date.getMonth() + 1); // Tháng trong JavaScript được đếm từ 0
  var year = addLeadingZero(date.getFullYear());

  // Lấy thông tin giờ, phút và giây
  var hours = addLeadingZero(date.getHours());
  var minutes = addLeadingZero(date.getMinutes());
  var seconds = addLeadingZero(date.getSeconds());

  return hours + ':' + minutes + ' ' + day + ':' + month + ':' + year;
}
function removeAccents(str) {
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substring(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

function debounce(callback, delay) {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function downloadFile(response, fileName) {
  var newBlob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }
  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement('a');
  link.href = data;
  link.download = fileName + '.docx';
  link.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(data);
  }, 100);
}

export { getLastTime, getVnTime, removeAccents, debounce, downloadFile, addLeadingZero };
