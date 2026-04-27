import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const dateFormat = (time, type) => {
  const date = dayjs(time).fromNow()
  let timeFormat = date;
  
  return timeFormat
}

export default dateFormat || 'wrong date'