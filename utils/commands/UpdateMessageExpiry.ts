import { getDb } from '@/storage/db'

export default async function SetDisapearsAt(msg_id: string) {
  if (!msg_id) return
  const db = await getDb()
  const now = Date.now()
  const getMessageSettings = await db.getFirstAsync('SELECT disappearing_millisecs FROM messages WHERE id = ?', [msg_id])
  if(!getMessageSettings?.disappearing_millisecs) return
  const finalMilliseconds = getMessageSettings?.disappearing_millisecs
  const disappears_at = now + Number(finalMilliseconds)
  console.log('Set message to deletes at', disappears_at)
  
  try {
    await db.runAsync(`
      UPDATE messages
      SET disappears_at = ?
      WHERE id = ?
    `, [disappears_at, msg_id])
  } catch (error) {
    console.error(error);
  }
}