import {getDb} from '@/storage/db'
import AppEvent, { Events } from '@/utils/eventEmitter';

export const UpdateMessage = async (data) => {
  const db = await getDb()
  const update = await db.getFirstAsync('UPDATE messages SET deleted = ?, content = ?, edited = ? WHERE id = ? AND sender_id = ? RETURNING *', [
    data.command === 'delete',
    data.content,
    data.command === 'edit',
    data.message_id,
    data.sender_id
  ])
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