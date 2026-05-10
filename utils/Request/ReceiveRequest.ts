import { getDb } from '@/storage/db'
import { v4 as uuidv4 } from 'uuid'

interface Request {
  id: string,
  sender_id: string,
  toUser: string,
  sent_at: string,
  message: string
}

const ReceiveRequest = async (req: Request) => {
  try {
    const db = await getDb()
    
    if (!req) return
    
    await db?.runAsync(`
      INSERT IF NOT EXISTS requests(
        id,
        sender_id,
        toUser,
        sent_at,
        message
      )
      VALUES(?, ?, ?, ?, ?)
    `, [
      req.id || uuidv4(),
      req.sender_id,
      req.toUser,
      req.sent_at,
      req.message
    ])
  } catch (error) {
    console.error(error)
  }
};