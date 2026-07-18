import { getDb } from '@/storage/db.ts';
import { unpinGlobalMessages, unpinMessage } from '../MessageServices/pin.ts'

export default async function VanishExpiredMessages() {
  try {
    const db = await getDb()
    const now = Date.now()
    const msgs = await db.getAllAsync(`
      DELETE FROM messages 
      WHERE disappears_at <= ?
      RETURNING *
    `, [now])
    for (const msg of msgs) {
      unpinMessage(msg.id)
    }
    await unpinGlobalMessages(now)
    console.log('✅ DELETED EXPIRED MESSAGES')
  } catch (error) {
    console.error(error);
  }
}