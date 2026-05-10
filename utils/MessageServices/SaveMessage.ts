import { getDb } from '../../storage/db.ts';
import { v4 as uuidv4 } from 'uuid';
import AppEvent, { Events } from '@/utils/eventEmitter';

const now = () => Date.now() / 1000;

interface Message {
  id?: string
  chat_id: string,
  sender_id: string,
  content: any,
  type: string,
  content_url?: string | null,
  attachments?: any | null,
  reply_to?: string | null,
  disappears_at?: number | null,
  to: string,
  room_type: string,
  created_at: number | null
} 

export const localMsgStore = async ({
  id,
  chat_id,
  sender_id,
  content,
  type = 'text',
  content_url,
  attachments = [],
  reply_to,
  disappears_at,
  to,
  room_type = 'private',
  created_at
} : Message, local: boolean = true) => {
  try {
    const db = await getDb();
    const message_id = uuidv4();
    const timestamp = now();
    
    const finalId = id || message_id;
    const finalCreatedAt = created_at || timestamp;
    
    const message = {
      id: finalId,
      chat_id,
      sender_id,
      content,
      type,
      content_url: content_url || null,
      reply_to: reply_to || null,
      status: 'Sending',
      created_at: finalCreatedAt,
      updated_at: finalCreatedAt,
      disappears_at: disappears_at || null,
      status_at: timestamp
    };
    const checkIfAlreadyExist = await db?.getFirstAsync('SELECT id FROM messages WHERE id = ?', [message.id]);
    if (checkIfAlreadyExist) return;
    
    await db?.withTransactionAsync(async () => {
      await db?.runAsync(
        `INSERT INTO messages (
            id, chat_id, sender_id, content, type, content_url, 
            reply_to, status, created_at, updated_at, disappears_at, status_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          message.id,
          message.chat_id,
          message.sender_id,
          message.content,
          message.type,
          message.content_url,
          message.reply_to,
          message.status,
          message.created_at,
          message.updated_at,
          message.disappears_at,
          message.status_at
        ]
      );
      
      if (local) {
        await db?.runAsync(
          `INSERT INTO pendings (message_id, toUser, room_type) VALUES (?, ?, ?)`,
          [message.id, to, room_type]
        );
      }
     
      for (const att of attachments) {
        await db?.runAsync(
          `INSERT INTO attachments (id, message_id, type, uri, width, height, duration, size, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), message.id, att.type, att.uri, att.width || null, att.height || null, att.duration || null, att.size || null, timestamp]
        );
      }
      
      await db?.runAsync(
        `UPDATE chats SET last_message_id = ?, last_message_preview = ?, last_message_at = ?, last_message_sender_id = ? WHERE id = ?`,
        [message.id, content, message.created_at, message.sender_id, message.chat_id]
      );
    });
    
    AppEvent.emit(Events.MSG_SEND, message);
    return message;
  } catch (error) {
    console.error("Local Store Error:", error);
  }
};

export const deleteMessage = async (id) => {
  const db = await getDb();
  await db?.runAsync('DELETE FROM messages WHERE id = ?',[id])
}