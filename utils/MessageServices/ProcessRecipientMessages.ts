import SetDisapearsAt from '@/utils/commands/UpdateMessageExpiry'
import { MessageStatus } from '@/utils/MessageServices/Status'
import { socket } from '@/hooks/sockets/socket_provider'
import { getDb } from '@/storage/db'

const queue = []
let isProcessing = false

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const MarkSeen = async (data) => {
  try {
    socket.emit('message:seen', { msg_id: data.id, at: Date.now(), toUser: data.sender_id, status: 'Seen' })
  } catch (err) {
    console.error("Failed to emit socket event:", err)
  }
}

export const ProcessRecipientMessages = (msg, returnBackData) => {
  if (!msg) return
  queue.push({ msg, returnBackData })
  
  if (!isProcessing) {
    Process()
  }
}

async function Process() {
  if (queue.length === 0) return
  try {
    isProcessing = true
    const db = await getDb()
    while (queue.length > 0) {
      const { msg, returnBackData } = queue.shift()
      MessageStatus(msg?.id, 'Seen', Date.now())
      if (msg?.disappearing_millisecs) {
        SetDisapearsAt(msg?.id, msg.disappearing_millisecs)
      }
      if(socket?.id) await MarkSeen(msg)
      else {
        await db.runAsync(`
          INSERT INTO pending_aks(
            msg_id,
            toUser,
            at,
            status
          )
          VALUES(?, ?, ?, ?)
        `, [msg.id, msg?.sender_id, Date.now(), 'Seen'])
      }
      await delay(50)
      if (typeof returnBackData === 'function') {
        returnBackData({ id: msg.id, status: 'Seen' })
      }
    }
  } catch (error) {
    console.error("Error in message queue processing:", error)
  } finally {
    isProcessing = false
    if (queue.length > 0) {
      Process()
    }
  }
}
