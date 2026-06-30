import { getDb } from '../../storage/db.ts';
import AppEvent, { Events } from '../eventEmitter.ts';

export const MessageStatus = async (message_id, status, status_at) => {
  try {
    const db = await getDb();
    const getMsgStatus = await db?.getAllAsync('SELECT status FROM messages WHERE id = ?', [message_id])
    if(getMsgStatus[0]?.status === 'Seen') return;
    
    await db?.runAsync(
      `
        UPDATE messages 
        SET 
          status = ?,
          status_at = ?
        WHERE 
          id = ?
      `,
      [status, status_at, message_id]
    );
    const emitObject = {
      msg_id: message_id,
      status, 
      at: status_at
    }
    AppEvent.emit(Events.MSG_STATUS_UPDATE, emitObject)
    console.log('Msg status edited successfully ✓');
  } catch (err) {
    console.error('Error:', err);
  }
};