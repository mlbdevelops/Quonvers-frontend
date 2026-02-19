import chat_socket from "./socket_provider.js";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SocketConnector() {
  const [user, setUser] = useState(null);
  
  const getValue = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        return value;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error reading value from AsyncStorage:', error);
      return {
        status: 'err'
      };
    }
  };
  
  useEffect(() => {
    async function getUser() {
      const currentUser = await getValue();
      if (!currentUser) return;
      if (currentUser.status) return await getValue();
      const u = JSON.parse(currentUser);
      if (u?.id) setUser(u?.id);
    }
    getUser();
  }, []);
  
  useEffect(() => {
    if (!user) return;
    if (!chat_socket.connected) chat_socket.connect();
    chat_socket.emit("register", user);
    return () => {
      chat_socket.disconnect();
    };
  }, [user]);

  return null;
}