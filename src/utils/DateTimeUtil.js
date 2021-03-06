export const DataFormate = {
  timeToStr: function(time) {
    let date = new Date(time)
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    )
  }
}
export const getFirstDayOfMonthStr = (d = new Date()) => {
  d.setDate(1)
  return parseTime(d, '{y}-{m}-{d}')
}
export const getLastDayOfMonthStr = (d = new Date()) => {
  var current = new Date(d)
  var currentMonth = current.getMonth()
  var nextMonth = ++currentMonth
  var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1)
  var minusDate = 1000 * 60 * 60 * 24
  return parseTime(new Date(nextMonthDayOne.getTime() - minusDate), '{y}-{m}-{d}')
}

export const parseTime = function(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export default {
  DataFormate,
  parseTime
}
