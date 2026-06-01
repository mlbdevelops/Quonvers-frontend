import { getDb } from '../../storage/db.ts';

export const getMessages = async ({ chat_id, cursor = null, limit = 5000 }: { chat_id: string, cursor?: string | null, limit?: number }) => {
  
  const db = await getDb();

  const query = `
    SELECT * 
    FROM messages
    WHERE chat_id = ? 
    ${cursor ? 'AND created_at < ?' : ''}
    ORDER BY created_at DESC
    LIMIT ?
  `;
  
  const params = cursor 
    ? [chat_id, cursor, limit] 
    : [chat_id, limit];
  
  const msgs = await db.getAllAsync(query, ...params);
  return msgs
}
