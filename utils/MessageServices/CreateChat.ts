import { getDb } from '@/storage/db'
import { storage } from '@/storage/mmkv'
import { v4 as uuidv4 } from 'uuid'
import userContext from '@/hooks/useUser'

/*export const createChat = async (recipient, chat_id) => {
  try {
    const userId = JSON.parse(storage.getString('user')).id
    if (!userId || !recipient.id) return
    const db = await getDb()
    
    const chechIfExist = await db.getAllAsync('SELECT id FROM chats WHERE id = ?', [chat_id])
    
    if (chechIfExist[0]) return
    
    const chat = {
      id: chat_id || uuidv4(),
      created_at: Date.now(),
    }
    
    const chat_member_me = {
      id: uuidv4(),
      chat_id: chat?.id,
      user_id: userId,
      joined_at: chat.created_at
    }
    
    const chat_member_recipient = {
      id: uuidv4(),
      chat_id: chat?.id,
      user_id: recipient.id,
      joined_at: chat.created_at
    }
    
    await db.runAsync(`
      INSERT OR IGNORE INTO chats(
        id,
        created_at
      )
      VALUES(?, ?)
    `,Object.values(chat))
    
    //My membership
    
    await db?.runAsync(`
      INSERT OR IGNORE INTO chat_members(
        id,
        chat_id,
        user_id,
        joined_at
      )
      VALUES(?, ?, ?, ?)
    `,Object.values(chat_member_me))
    
    // Recipient's membership
    
    await db?.runAsync(`
      INSERT OR IGNORE INTO chat_members(
        id,
        chat_id,
        user_id,
        joined_at
      )
      VALUES(?, ?, ?, ?)
    `,Object.values(chat_member_recipient))
    
    //save the recipient's meta
    
    await db.runAsync(`
      INSERT OR IGNORE INTO users(
        user_id,
        avatar,
        username,
        name
      )
      VALUES(?, ?, ?, ?)
    `, [recipient.id, recipient.avatar, recipient.username, recipient.name])
    
    console.log('Chat created successfully ✅');
  } catch (err) {
    console.error('Error:', err);
  }
}
*/

export const createChat = async (recipient, chat_id, status = 'accepted') => {
  try {
    
    const userString = storage.getString('user')
    const { user } = JSON.parse(userString)
    console.log('Logged user =>> ', user);
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
    
    console.log(`Chat ${chat_id} initialized as ${status} ✅`);
    return chat_id;
  } catch (err) {
    console.error('Failed to create chat:', err);
  }
};
