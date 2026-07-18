import { getDb } from '@/storage/db'

export const pin_message = async (message_id, unpin_at, chat_id) => {
  if(!message_id || !unpin_at) return
  try {
    const db = await  getDb()
    await db.runAsync(
      `INSERT INTO pinned_messages(
        message_id,
        unpin_at,
        pinned_at,
        chat_id
      ) VALUES(?, ?, ?, ?)`, [message_id, unpin_at, Date.now(), chat_id]
    )
  } catch (error) {
    console.error(error);
  }finally{
    console.log('Message pinned')
  }
}

export const unpinMessage = async (message_id) => {
  if(!message_id) return
  try {
    const db = await getDb()
    await db.runAsync(
      `DELETE FROM pinned_messages WHERE message_id = ?`, [message_id]
    )
  } catch (error) {
    console.error(error);
  }finally{
    console.log('Message unpinned')
  }
}

export const unpinGlobalMessages = async (now) => {
  try {
    const db = await getDb()
    await db.runAsync(
      `DELETE FROM pinned_messages WHERE unpin_at <= ?`, [now]
    )
  } catch (error) {
    console.error(error);
  }finally{
    console.log('Erased pinned messages')
  }
}

export const getPinnedMessages = async (chat_id) => {
  if(!chat_id) return
  try {
    const db = await  getDb()
    return await db.getAllAsync(
      `SELECT 
        msg.content,
        pm.unpin_at,
        pm.pinned_at,
        msg.id AS message_id,
        pm.chat_id
      FROM pinned_messages pm
      JOIN messages msg ON msg.id = pm.message_id
      WHERE pm.chat_id = ?`, [chat_id]
    )
  } catch (error) {
    console.error(error);
  }
}

export const getSinglePinnedMessage = async (message_id) => {
  if(!message_id) return
  try {
    const db = await getDb()
    const isPinned =  await db.getFirstAsync(
      `SELECT * FROM pinned_messages WHERE message_id = ?`, [message_id]
    )
    return isPinned? true : false
  } catch (error) {
    console.error(error);
  }
}