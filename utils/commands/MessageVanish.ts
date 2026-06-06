import { getDb } from '@/storage/db';
import AppEvent, { Events } from '@/utils/eventEmitter'

export default async function MessageVanish(c) {
  try {
    const db = await getDb()
    const check = await db.getFirstAsync(`
      SELECT 
        dm.chat_id
      FROM 
        chat_members cm
      RIGHT JOIN 
        disappear_setting dm 
          ON 
            dm.chat_id = cm.chat_id
      WHERE cm.user_id = ?`, 
      [c.sender_id]
    ) || {}
    
    if(!check?.chat_id){
      console.log('Adding record')
      await db.runAsync(`
        INSERT INTO disappear_setting(
          chat_id,
          disappearing_millisecs,
          ui_index,
          set_by
        )
        VALUES(?, ?, ?, ?)
      `, [
        check.chat_id,
        c.value.duration,
        c.value.ui_index,
        c.sender_id
      ])
    }else{
      console.log('Editing record')
      await db.runAsync(`
        UPDATE disappear_setting
        SET disappearing_millisecs = ?, ui_index = ?, set_by = ?
        WHERE chat_id = ?
      `, [
        c.value.duration,
        c.value.ui_index,
        c.sender_id,
        check.chat_id
      ])
    }
  } catch (error) {
    console.error(error);
  }finally{
    AppEvent.emit(Events.MSG_VANISH, {
      chat_id: c.chat_id,
      duration: c.value.duration,
      selectionText: null
    })
    console.log('Done processing')
  }
}