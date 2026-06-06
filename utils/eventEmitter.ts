import EventEmitter from 'eventemitter3'
const AppEvent = new EventEmitter()

export const Events = {
  NEW_MESSAGE: 'new_message',
  MSG_STATUS_UPDATE: 'msg_status_update',
  REQUEST_SUBMISSION: 'friend_request_submission',
  MSG_SEND: 'message_send',
  NICKNAME_CHANGE: 'nickname_change',
  MSG_VANISH: 'message_vanish'
}

export default AppEvent