import { useContext } from 'react'
import { ChatContext } from '@/contexts/chatContext'

export default function chatContext(){
  return useContext(ChatContext)
}
