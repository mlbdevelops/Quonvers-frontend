import { getDb } from '../../storage/db.ts';
import { messageEmitter } from './index';
const now = () => Math.floor(Date.now() / 1000);

export const markAsRead = async (chat_id, user_id) => {
  const { execAsync } = getDb();
  const [latest] = await execAsync(
    `SELECT id FROM messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT 1`,
    [chat_id]
  );
  const lastMessageId = latest.rows._array[0]?.id;
  if (!lastMessageId) return;

  const timestamp = now();

  await execAsync(
    `UPDATE chat_members
     SET last_read_message_id = ?, last_read_at = ?, unread_count = 0
     WHERE chat_id = ? AND user_id = ?`,
    [lastMessageId, timestamp, chat_id, user_id]
  );

  await execAsync(
    `INSERT INTO message_receipts (message_id, user_id, read_at)
     VALUES (?, ?, ?)
     ON CONFLICT(message_id, user_id) DO UPDATE SET read_at = excluded.read_at`,
    [lastMessageId, user_id, timestamp]
  );

  messageEmitter.emit('messages_read', { chat_id, user_id });
};