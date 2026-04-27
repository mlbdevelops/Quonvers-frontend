type Message = {
  sender_id: string
}

type Tick = {
  message: Message
  next?: Message
  myId: string
}

function shouldShowReceipt({ message, next, myId }: Tick) {
  if (message.sender_id !== myId) return false
  if (!next) return true
  return next.sender_id !== myId
}
