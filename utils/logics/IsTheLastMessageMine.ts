function isTheLastMessageMine(messages: any) {
  return messages[messages.length + 1].sender_id === logged_user
}