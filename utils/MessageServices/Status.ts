import { getDb } from '../../storage/db.ts';
import { messageEmitter } from './index';
const now = () => Math.floor(Date.now() / 1000);

export const updateMessageStatus = async (message_id, status) => {
  const { execAsync } = getDb();
  const timestamp = now();

  await execAsync(
    `UPDATE messages SET send_status = ?, updated_at = ? WHERE id = ?`,
    [status, timestamp, message_id]
  );

  messageEmitter.emit('message_status', { message_id, status });
};