import { getDb } from '../../storage/db.ts';
import { v4 as uuidv4 } from 'uuid';
import { messageEmitter } from './index.ts';

const now = () => Math.floor(Date.now() / 1000);

interface Message {
  id?: string
  chat_id: string,
  sender_id: string,
  content: any,
  type: string,
  media_url?: string | null,
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
  media_url,
  attachments = [],
  reply_to,
  disappears_at,
  to,
  room_type = 'private',
  created_at
} : Message, local = true) => {
  try {
    const db = await getDb();
    const message_id = await uuidv4();
    const timestamp = now();
    const message = {
      id: id || message_id,
      chat_id,
      sender_id,
      content,
      type,
      media_url: media_url || null,
      reply_to: reply_to || null,
      status: 'Sending',
      created_at: created_at || timestamp,
      updated_at: created_at || timestamp,
      disappears_at: disappears_at || null
    };
    //console.log(message);
    const checkIfAlreadyExist = await db?.getAllAsync('SELECT * FROM messages WHERE id = ?', [message.id])
    console.log(checkIfAlreadyExist);
    if (checkIfAlreadyExist.length) return 
    
    // Insert message
    await db?.runAsync(
      `INSERT INTO messages
        (
          id,
          chat_id,
          sender_id,
          content,
          type,
          media_url,
          reply_to,
          status,
          created_at,
          updated_at,
          disappears_at
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(message)
    );
    
    //Insert pendings
    if (local) {
      await db?.runAsync(
        `INSERT INTO pendings
          (
            message_id,
            toUser,
            room_type
          )
         VALUES (?, ?, ?)`,
        [message.id, to, room_type]
      );
    }
    
    // Insert attachments
    for (const att of attachments) {
      const att_id = uuidv4();
      await db?.runAsync(
        `INSERT INTO attachments (id, message_id, type, uri, width, height, duration, size, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [att_id, message_id, att.type, att.uri, att.width || null, att.height || null, att.duration || null, att.size || null, timestamp]
      );
    }
    
    // Update chat last message
    await db?.runAsync(
      `UPDATE chats SET last_message_id = ?, last_message_preview = ?, last_message_at = ?, last_message_sender_id = ? WHERE id = ?`,
      [message_id, content, timestamp, message.sender_id, chat_id]
    );
    
    // Emit message to UI
    // messageEmitter.emit('new_message', message);
    return message; // local message with ID
  } catch (error) {
    console.error(error);
  }
};

export const deleteMessage = async (id) => {
  const db = await getDb();
  await db?.runAsync('DELETE FROM messages WHERE id = ?',[id])
}