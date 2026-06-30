import { socket } from '@/hooks/sockets/socket_provider'
import { MessageStatus } from './Status'
import { getDb } from '../../storage/db.ts';
import { storage } from '@/storage/mmkv'
import { createChat } from "@/utils/MessageServices/CreateChat"
import { AuthContext } from '@/utils/authContext'

const retry = (msg) => {
  setTimeout(() => {
    sendMessage(msg)
  }, 5000);
}

export async function sendMessage(msg, recipient) {
  try {
    if (!msg || !socket?.connected) return
    const db = await getDb();
    const checkIfExist = await db?.getFirstAsync('SELECT id FROM chats WHERE id = ?', [msg?.chat_id])
    if (checkIfExist?.id) {
      socket.emit("message:send", msg, async (ack) => {
        if (!ack?.ok) return retry(msg);
        await MessageStatus(msg.id, 'Sent', ack.at);
        await db?.runAsync('DELETE FROM pendings WHERE message_id = ?',[msg.id])
      });
    }else{
      const userString = storage.getString('user')
      const { user } = JSON.parse(userString)
      await createChat(recipient, msg.chat_id)
      socket.emit("message:send", {...msg, sender_data: {
        id: user.id,
        avatar: user.avatar,
        name: user.name,
        username: user.username
      }}, async (ack) => {
        if (!ack?.ok) return retry(msg);
        await MessageStatus(msg.id, 'Sent', ack.at);
        await db?.runAsync('DELETE FROM pendings WHERE message_id = ?',[msg.id])
      });
    }
  } catch (err) {
    console.error('Error:', err);
  }
}