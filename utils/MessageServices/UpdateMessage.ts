import {getDb} from '@/storage/db'
import AppEvent, { Events } from '@/utils/eventEmitter';

export const UpdateMessage = async (data) => {
  const db = await getDb()

  const updateMessage = async () => {
    console.log('EDITING...')
    return await db.getFirstAsync('UPDATE messages SET content = ?, edited = ? WHERE id = ? AND sender_id = ? RETURNING *', [
      data.content,
      true,
      data.message_id,
      data.sender_id
    ])
  }
  
  const deleteMessage = async () => {
    console.log('DELETING...')
    return await db.getFirstAsync('UPDATE messages SET deleted = ?, content = ?, reply_to = ? WHERE id = ? AND sender_id = ? RETURNING *', [
      true,
      null,
      null,
      data.message_id,
      data.sender_id
    ])
  }
  
  const update = data.command == 'edit'? await updateMessage() : await deleteMessage()
  console.log('HELLO FROM SOCKET MESSAGE UPDATE')
  console.log(update)
  if(update) AppEvent.emit(Events.UPDATE_MESSAGE, {
    content: update?.content,
    sender_id: update?.sender_id,
    deleted: update?.deleted,
    edited: update?.edited,
    message_id: update?.id,
    chat_id: update?.chat_id,
    command: data.command
  })
}