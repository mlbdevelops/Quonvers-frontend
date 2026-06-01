import { getDb } from '../../storage/db.ts';
import AppEvent, { Events } from '../eventEmitter.ts';
const now = () => Math.floor(Date.now() / 1000);

export const MessageStatus = async (message_id, status, status_at) => {
  try {
    const db = await getDb();
    const timestamp = now();
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
      [status, status_at / 1000, message_id]
    );
    AppEvent.emit(Events.MSG_STATUS_UPDATE, {msg_id: message_id, status, at: status_at})
    console.log('Msg status edited successfully ✓');
  } catch (err) {
    console.error('Error:', err);
  }
  //messageEmitter.emit('message_status', { message_id, status });
};