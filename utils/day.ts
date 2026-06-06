import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const DateFormat = (time: any, chat_box_format = false) => {
  const dayjsObj = dayjs(time);
  if (!dayjsObj.isValid()) {
    return ""; 
  }
  
  if (chat_box_format) {
    return dayjsObj.format('hh:mm A'); 
  }
  
  const relativeDateString = dayjsObj.fromNow();
  
  return relativeDateString
    .replace('minutes', 'mins')
    .replace('a few seconds ago', 'now')
    .replace('a minute', '1 min')
    .replace('an hour', '1 hr')
    .replace('an', '1');
};

export default DateFormat