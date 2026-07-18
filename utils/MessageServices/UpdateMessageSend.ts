import { getDb } from '@/storage/db'
import { socket } from '@/hooks/sockets/socket_provider'

export const SendMessageUpdate = async (params) => {
  if(!params.toUser || !params.sender_id) return
  const db = await getDb()
  try {
    if(socket?.id){
      socket.emit('messageCommands:send', {
        sender_id: params?.sender_id,
        toUser: params?.toUser,
        command: params?.command,
        content: params?.content,
        message_id: params?.message_id
      })
      console.log('FROM SOCKET SEND', params)
    }else{
      console.log('FROM THE SAVE BUTTON', params)
      await db.runAsync('DELETE FROM pending_msg_updates WHERE message_id = ?', [params?.message_id])
      await db.runAsync(`
        INSERT INTO pending_msg_updates(
          message_id,
          content,
          toUser,
          sender_id,
          command
        )
        VALUES(?, ?, ?, ?, ?)
      `, [params.message_id, params.content, params.toUser, params.sender_id, params.command])
    }
  } catch (error) {
    console.error(error);
  }
}