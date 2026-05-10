import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const DateFormat = (time, type) => {
  const date = dayjs(time).fromNow()
  return date.replace('minutes', 'mins').replace('a few seconds ago', 'now').replace('a minute', '1 min')
}

export default DateFormat || 'Date problem'