import { createContext, useState, useEffect, PropsWithChildren } from 'react'

type ChatState = {
  activeChatRoomId: string,
  setActiveChatRoomId: () => void
}

export const ChatContext = createContext<ChatState>({
  activeChatRoomId: null,
  setActiveChatRoomId: () => {}
})

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null)
  
  useEffect(() => {
    console.log(activeChatRoomId)
  }, [activeChatRoomId])
  
  
  return (
    <ChatContext.Provider
      value={{
        setActiveChatRoomId,
        activeChatRoomId
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}