import { useEffect, useState } from "react";
import { storage } from "../../storage/mmkv";
import { getDb } from "@/storage/db";
import { socket } from './socket_provider.ts'
import { sendMessage, SendMessageUpdate } from '@/utils/MessageServices/index'

export default function SocketConnector() {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    async function getUser() {
      try {
        const token = await storage.getString("token");
        if (!token) return;
        console.log(token);
        if (token) setToken(token);
      } catch (err) {
        console.error(err);
      }
    }
    getUser();
  }, []);
  
  const connectSocket = async (token: string) => {
    const db = await getDb()
    if (!socket.connected) socket.connect();
    //const myChats = await db.getAllAsync('SELECT id FROM chats')
    socket.on("connect", async () => {
      console.log("Socket connected:", socket.id);
      if (token) socket.emit("new_connection", token);
      const userString = storage.getString("user");
      const { user } = JSON.parse(userString)
      const pending_msgs = await db?.getAllAsync(`
        SELECT 
          *
        FROM 
          messages m
        JOIN 
          pendings p 
            ON 
              p.message_id = m.id
        WHERE status = ? AND sender_id = ?`, 
        ['Sending', user?.id]
      )
      for(const msg of pending_msgs){
        delete msg.message_id
        sendMessage(msg)
      }
      
      const pending_aks = await db?.getAllAsync(`
        DELETE FROM pending_aks RETURNING *`
      )
      
      for(const aks of pending_aks){
        socket.emit('message:seen', aks)
      }
      
      const pending_msg_updates = await db?.getAllAsync(`
        DELETE FROM pending_msg_updates RETURNING *`
      )
      
      for(const pmu of pending_msg_updates){
        SendMessageUpdate(pmu)
      }
    });
    
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  };
  
  useEffect(() => {
    if (!token) return;
    connectSocket(token);
    setTimeout(() => {
      if (!socket.connected) connectSocket(token);
    }, 5000);
  }, [token]);

  return null;
}