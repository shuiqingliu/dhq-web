/**
 * 获取当前时间 格式：yyyy-MM-dd HH:MM:SS
 */
export function getNowFormatDate() {
  const date = new Date()// 当前时间
  const month = zeroFill(date.getMonth() + 1)// 月
  const day = zeroFill(date.getDate())// 日
  const hour = zeroFill(date.getHours())// 时
  const minute = zeroFill(date.getMinutes())// 分
  const second = zeroFill(date.getSeconds())// 秒

  // 当前时间
  const formatDate = date.getFullYear() + '-' + month + '-' + day +
    ' ' + hour + ':' + minute + ':' + second

  return formatDate
}

/**
 * 补零
 */
function zeroFill(i) {
  if (i >= 0 && i <= 9) {
    return '0' + i
  } else {
    return i
  }
}
