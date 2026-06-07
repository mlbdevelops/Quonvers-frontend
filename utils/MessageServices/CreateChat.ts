import { getDb } from '@/storage/db'
import { storage } from '@/storage/mmkv'
import { v4 as uuidv4 } from 'uuid'
import userContext from '@/hooks/useUser'

export const createChat = async (recipient, chat_id, status = 'accepted') => {
  try {
    const userString = storage.getString('user')
    const { user } = JSON.parse(userString)
    const userId = user?.id
    
    if (!userId || !recipient.id) return;
    const db = await getDb();
    
    await db?.withTransactionAsync(async () => {
      
      //Insert into chat table
      await db?.runAsync(`
        INSERT OR IGNORE INTO chats (id, status, created_at, last_message_id)
        VALUES (?, ?, ?, ?)
      `, [chat_id, status, Date.now(), recipient.msg_id]);
      
      // 2. Insert Recipient into 'users' table
      await db?.runAsync(`
        INSERT OR IGNORE INTO users (user_id, avatar, username, name)
        VALUES (?, ?, ?, ?)
      `, [recipient.id, recipient.avatar, recipient.username, recipient.name]);
      
      // 3. Create Memberships
      const myMembershipId = uuidv4();
      const recipientMembershipId = uuidv4();
      const now = Date.now();
      
      await db?.runAsync(`
        INSERT OR IGNORE INTO chat_members (id, chat_id, user_id, joined_at)
        VALUES (?, ?, ?, ?), (?, ?, ?, ?)
      `, [
        myMembershipId, chat_id, userId, now,
        recipientMembershipId, chat_id, recipient.id, now
      ]);
    });
    return chat_id;
  } catch (err) {
    console.error('Failed to create chat:', err);
  }
};
