import { getDb } from '../../storage/db.ts';
import { messageEmitter } from './index';
const now = () => Math.floor(Date.now() / 1000);

export const MessageStatus = async (message_id, status, status_at) => {
  try {
    const db = await getDb();
    const timestamp = now();
    
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
    console.log('Msg status edited successfully ✓');
  } catch (err) {
    console.error('Error:', err);
  }
  //messageEmitter.emit('message_status', { message_id, status });
};