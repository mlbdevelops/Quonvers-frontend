import { getDb } from '@/storage/db.ts';

export default async function VanishExpiredMessages() {
  try {
    const db = await getDb()
    const now = Date.now()
    await db.runAsync(`
      DELETE FROM messages WHERE disappears_at + ? <= ?
    `, [now, now])
  } catch (error) {
    console.error(error);
  }
}