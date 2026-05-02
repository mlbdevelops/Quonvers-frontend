import { createContext, useState, useEffect, PropsWithChildren } from 'react'
import { useRouter } from 'expo-router'
import { storage } from '@/storage/mmkv'
import { getMessages } from '../utils/MessageServices/GetMesages.ts'
import { localMsgStore, deleteMessage } from '@/utils/MessageServices/index'
import { socket } from '@/hooks/sockets/socket_provider'

type ChatState = {
  messages: any[],
  isReady: boolean,
  pass_id: (chat_id: string) => void
  load_messages: (chat_id: string) => void,
  setIsReady: () => void
}

export const ChatContext = createContext<ChatState>({
  messages: [],
  isReady: false,
  pass_id: () => {},
  load_messages: () => {},
  setIsReady: () => {}
})

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [user, setUser] = useState<string | null>(null)
  const [chat_id, setChat_id] = useState<string | null>(null)
  const [messages, setMessages] = useState<any | null>([])
  
  const router = useRouter()
  
  useEffect(() => {
    return console.log(null);
    ( async () => {
      console.log(chat_id)
      if(chat_id){
        const messages = await getMessages({chat_id})
        if(messages.length){
          await setMessages(messages)
        }
      }
      setIsReady(true)
    })()
  }, [chat_id])
  
  useEffect(() => {
    socket.on('message:receive', async (data) => {
      const saveMsg = await localMsgStore(data)
    })
    return () => socket.disconnect()
  }, [])
  
  
  const load_messages = async (chat_id) => {
    console.log(chat_id)
    if(chat_id){
      const messages = await getMessages({chat_id})
      if(messages.length){
        await setMessages(messages)
      }
      setIsReady(true)
    }
  }
  
  const pass_id = async (chat_id) => {
    setChat_id(chat_id)
    return chat_id
  }
  
  return (
    <ChatContext.Provider
      value={{
        isReady,
        messages,
        pass_id,
        load_messages,
        setIsReady
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}