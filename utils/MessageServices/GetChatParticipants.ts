import { getDb } from '@/storage/db'

export async function GetChatParticipants(chat_id:string) {
  if(!chat_id) return
  const db = await getDb()
  const parts = await db.getAllAsync(`
    SELECT
      cm.nickname,
      u.name,
      u.user_id,
      u.username,
      u.avatar,
      u.is_pro
    FROM chat_members cm
    LEFT JOIN users u ON u.user_id = cm.user_id
    WHERE cm.chat_id = ?
  `, [chat_id])
  return parts
}