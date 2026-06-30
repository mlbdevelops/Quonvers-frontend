import { getDb } from '../../storage/db.ts';
import { v4 as uuidv4 } from 'uuid';
import AppEvent, { Events } from '@/utils/eventEmitter';
import { storage } from '@/storage/mmkv'

interface MessageProps {
  id?: string
  chat_id: string,
  sender_id: string,
  content: any,
  type: string,
  content_url?: string | null,
  attachments?: any | null,
  reply_to?: string | null,
  disappears_at?: number,
  to: string,
  room_type: string,
  created_at: number | null,
  deleted
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
  created_at,
  disappearing_millisecs,
  deleted
} : MessageProps, activeChatRoomId: string | null = null) => {
  try {
    const db = await getDb();
    const message_id = uuidv4();
    const timestamp = Date.now();
    const { user } = JSON.parse(storage.getString('user'))
    const finalId = id ?? message_id;
    const finalCreatedAt = created_at ?? timestamp;
    const isLogged = user.id === sender_id
    
    const existingMember = await db.getFirstAsync(
      `SELECT 
        chat_id
      FROM 
        chat_members
      WHERE user_id = ?`,
      [sender_id]
    );
    
    const message = {
      id: finalId,
      chat_id: isLogged? chat_id : (existingMember?.chat_id ?? chat_id),
      sender_id,
      content,
      type,
      content_url: content_url || null,
      reply_to: reply_to || null,
      status: isLogged ? 'Sending' : 'Delivered',
      created_at: Number(finalCreatedAt),
      updated_at: Number(finalCreatedAt),
      disappears_at: null,
      status_at: Number(timestamp),
      disappearing_millisecs: Number(disappearing_millisecs),
      room_type,
      deleted
    };
    
    const checkIfAlreadyExist = await db?.getFirstAsync('SELECT id FROM messages WHERE id = ?', [message.id]);
    if (checkIfAlreadyExist) return;
    
    await db?.runAsync(
      `INSERT INTO messages (
        id, chat_id, sender_id, content, type, content_url, reply_to, status, created_at, updated_at, disappears_at, status_at, disappearing_millisecs, room_type, deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        message.status_at,
        message.disappearing_millisecs,
        message.room_type,
        message.deleted
      ]
    );
    
    if (message.sender_id === user.id) {
      await db?.runAsync(
        `INSERT INTO pendings (message_id, toUser, room_type) VALUES (?, ?, ?)`,
        [message.id, to, room_type]
      );
    }
    
    if (message?.sender_id !== user?.id && activeChatRoomId !== message.chat_id) {
      await db?.runAsync(
        `UPDATE chats 
        SET has_unread = ?
        WHERE id = ?`,
        [true, message?.chat_id]
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
      `UPDATE chats SET last_message_id = ?, last_change_timestamp = ? WHERE id = ?`,
      [message.id, message?.created_at, message.chat_id]
    );
    AppEvent.emit(Events.MSG_SEND, message);
    return message;
  } catch (error) {
    console.error("Local Store Error:", error);
  }
};

export const deleteMessage = async (message_id, chat_id, updateLastChatTo) => {
  try {
    const db = await getDb();
    await db?.runAsync('DELETE FROM messages WHERE id = ?',[message_id])
    await db?.runAsync('DELETE FROM pendings WHERE message_id = ?',[message_id])
    if(updateLastChatTo) await db?.runAsync('UPDATE chats SET last_message_id = ? WHERE id = ?', [updateLastChatTo.id, chat_id])
  } catch (error) {
    console.error(error);
  }finally{
    if(updateLastChatTo) AppEvent.emit(Events.MSG_SEND, {...updateLastChatTo, disable_ui_update: true})
  }
}
