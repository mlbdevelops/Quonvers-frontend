import { getSocket } from '../../hooks/sockets/socket_provider.ts';
import { updateMessageStatus, markAsRead, messageEmitter } from '../MessageServices';
import { getDb } from '../../storage/db.ts';

export const setupSocketListeners = () => {
  const socket = getSocket();

  // Update message status when delivered
  socket.on('message:delivered', ({ message_id }: { message_id: string }) => {
    updateMessageStatus(message_id, 'delivered');
  });

  // Mark messages as read
  socket.on('message:read', ({ chat_id, user_id }: { chat_id: string; user_id: string }) => {
    markAsRead(chat_id, user_id);
  });

  // Update reactions
  socket.on('message:reaction', ({ message_id, user_id, reaction }) => {
    messageEmitter.emit('message-reacted', { message_id, user_id, reaction });
  });

  // Retry pending messages on reconnect
  socket.on('connect', async () => {
    console.log('Socket reconnected, retrying pending messages...');
    try {
      const { execAsync } = getDb();
      const [result] = await execAsync(`SELECT * FROM messages WHERE send_status = 'pending'`);
      const pendingMessages = result.rows._array;
      for (const msg of pendingMessages) {
        socket.emit('message:send', msg, async (response: any) => {
          if (response.success) {
            await updateMessageStatus(msg.id, 'sent');
          } else {
            await updateMessageStatus(msg.id, 'failed');
          }
        });
      }
    } catch (error) {
      console.error('Error retrying pending messages:', error);
    }
  });
};