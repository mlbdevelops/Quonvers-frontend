import { useEffect, useState } from "react";
import { storage } from "../../storage/mmkv";
import { getDb } from "@/storage/db";
import { socket } from './socket_provider.ts'
import { sendMessage } from '@/utils/MessageServices/index'

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
      const pending_msgs = await db?.getAllAsync(`
        SELECT 
          *
        FROM 
          messages m
        JOIN 
          pendings p 
            ON 
              p.message_id = m.id
        WHERE status = ?`, 
        ['Sending']
      )
      for(const msg of pending_msgs){
        console.log(msg);
        sendMessage(msg)
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