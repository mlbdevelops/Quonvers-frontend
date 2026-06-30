import { getDb } from '@/storage/db.ts';

export default async function VanishExpiredMessages() {
  try {
    const db = await getDb()
    const now = Date.now()
    const msgs = await db.runAsync(`
      DELETE FROM messages 
      WHERE disappears_at <= ?
    `, [now])
    console.log('❌ DELETED EXPIRED MESSAGES')
  } catch (error) {
    console.error(error);
  }
}