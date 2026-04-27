import { getDb } from '../../storage/db.ts';
import { v4 as uuidv4 } from 'uuid';
import { messageEmitter } from './index';

const now = () => Math.floor(Date.now() / 1000);

export const reactToMessage = async (message_id, user_id, reaction) => {
  const { execAsync } = getDb();
  const id = uuidv4();
  const timestamp = now();

  await execAsync(
    `INSERT INTO message_reactions (id, message_id, user_id, reaction, reacted_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(message_id, user_id) DO UPDATE SET reaction = excluded.reaction, reacted_at = excluded.reacted_at`,
    [id, message_id, user_id, reaction, timestamp]
  );

  messageEmitter.emit('message_reacted', { message_id, user_id, reaction });
};