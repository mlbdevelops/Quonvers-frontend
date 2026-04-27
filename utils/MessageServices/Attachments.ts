import { getDb } from '../../storage/db.ts';
import { v4 as uuidv4 } from 'uuid';

const now = () => Math.floor(Date.now() / 1000);

export const saveAttachment = async (att) => {
  const { execAsync } = getDb();
  const id = uuidv4();
  const timestamp = now();

  await execAsync(
    `INSERT INTO attachments
     (id, message_id, type, uri, width, height, duration, size, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, att.message_id, att.type, att.uri, att.width || null, att.height || null, att.duration || null, att.size || null, timestamp]
  );

  return { id, ...att, created_at: timestamp };
};