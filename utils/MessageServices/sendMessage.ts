import { socket } from '@/hooks/sockets/socket_provider'
import { MessageStatus } from './Status'
import { getDb } from '../../storage/db.ts';

const retry = (msg) => {
  sendMessage(msg)
}

export function sendMessage(msg, check) {
  try {
    if (!msg || !socket.connected) return
    socket.emit("message:send", msg, async (ack) => {
      if (!ack?.ok) return retry(msg);
      const db = await getDb();
      await MessageStatus(msg.id, 'Sent', ack.at);
      await db?.runAsync('DELETE FROM pendings WHERE message_id = ?',[msg.id])
      check('Message sent', msg.id)
    });
  } catch (err) {
    console.error('Error:', err);
  }
}