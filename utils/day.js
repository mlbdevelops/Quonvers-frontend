import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const dateFormat = (time) => {
  let timeFormat;
  const date = dayjs(time).fromNow()
  if (date.includes('minutes')) {
    timeFormat = date.replace(' minutes', 'm')
  }else if(date.includes('a day')){
    timeFormat = date.replace('a day', '1d')
  }else if(date.split(' ').includes('day')){
    timeFormat = date.replace(' day', 'd')
  }else if(date.split(' ').includes('days')){
    timeFormat = date.replace(' days', 'd')
  }else if(date.includes('a few seconds')){
    timeFormat = 'now'
  }else if(date.includes('seconds')){
    timeFormat = date.replace('seconds', 's')
  }else if(date.includes('a minute')){
    timeFormat = '1m'
  }else if(date.includes('an hour')){
    timeFormat = date.replace('an hour', '1h')
  }else if(date.includes('hours')){
    timeFormat = date.replace(' hours', 'h')
  }
  
  return timeFormat && timeFormat.replace('ago', '')
}

export default dateFormat