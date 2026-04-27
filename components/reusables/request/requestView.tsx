import Image from '../Image';
import Button from '../button';
import React from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList, Pressable, Image as Img } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { X, Ellipsis } from 'lucide-react-native'
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, UserCircleIcon } from '@hugeicons/core-free-icons';
import haptics from '@/hooks/haptics'
import { useState, useEffect, useContext } from 'react'
import trans from '@/hooks/fetch'
import { toast } from "@/utils/toaster/toast"
import { getDb } from '@/storage/db'
import { v4 as uuidv4 } from 'uuid'

interface RequestProps {
  item?: any,
  isLast?: boolean,
  onSubmit?: () => void
}

const RequestView = ({item, isLast, onSubmit}: RequestProps) => {
  const { handleViber } = haptics()
  const [loading, setLoading] = useState(false)
  
  const createChat = async () => {
    try {
      const db = await getDb()
      const chat = {
        id: uuidv4(),
        type: 'private',
        created_at: Date.now(),
      }
      
      const chat_member_me = {
        id: uuidv4(),
        chat_id: chat?.id,
        user_id: item.receiver_id,
        nickname: null,
        role: 'member',
        joined_at: chat.created_at
      }
      
      const chat_member_recipient = {
        id: uuidv4(),
        chat_id: chat?.id,
        user_id: item.sender_id,
        nickname: null,
        role: 'member',
        joined_at: chat.created_at
      }
      
      await db.runAsync(`
        INSERT INTO chats(
          id,
          type,
          created_at
        )
        VALUES(?, ?, ?)
      `,Object.values(chat))
      
      //My membership
      
      await db?.runAsync(`
        INSERT INTO chat_members(
          id,
          chat_id,
          user_id,
          nickname,
          role,
          joined_at
        )
        VALUES(?, ?, ?, ?, ?, ?)
      `,Object.values(chat_member_me))
      
      // Recipient's membership
      
      await db?.runAsync(`
        INSERT INTO chat_members(
          id,
          chat_id,
          user_id,
          nickname,
          role,
          joined_at
        )
        VALUES(?, ?, ?, ?, ?, ?)
      `,Object.values(chat_member_recipient))
      
      const cache_user_data = {
        id: uuidv4(),
        username: item.sender_username,
        name: item.sender_name,
        user_id: item.sender_id,
        avatar: item.sender_avatar,
        bio: item.bio,
        is_verified: item.is_verified,
        created_at: Date.now()
      }
      
      await db?.runAsync(`
        INSERT INTO users(
          id,
          username,
          name,
          user_id,
          avatar,
          bio,
          is_verified,
          created_at
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
      `,Object.values(cache_user_data))
      
      console.log('Chat created successfully ✅');
      return true
    } catch (err) {
      console.error('Error:', err);
    }
    return false
  }
  
  const accept_req = async () => {
    try {
      if (!item) return
      const createChatRecord = await createChat()
      if (!createChatRecord) return
      const accept = await trans('/api/chat/createConversation', {
        body: { 
          sender: item.sender_id,
          receiver: item.receiver_id,
          req_id : item.id 
        }
      })
      if (accept.code == 904) {
        toast('Request accepted ✓')
        onSubmit(item.id)
      }
      console.log('Request accepted successfully 🤌🏻');
    } catch (err) {
      toast('Something went wrong, try again.')
    }
  }
  
  return (
    <View style={{
      paddingVertical: 10,
      borderBottomWidth: isLast? 0 : 0,
      borderColor: '#1d1d1d',
      flexDirection: 'row',
      //borderWidth: 1,
      //borderColor: 'red',
    }}>
      <View>
        <Image style={{
          height: 50,
          width: 50,
        }} src={item.sender_avatar}/>
      </View>
      <View style={{
        flex: 1,
        //justifyContent: 'center',
        gap: 3,
        marginLeft: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 5,
          borderWidth: 0,
          borderColor: 'red',
        }}>
          <Text numberOfLines={1} style={{
            color: 'white',
            fontWeight: 'bold',
            //maxWidth: '60%',
            flex: 1,
            fontSize: 15,
          }}>{item.sender_username}</Text>
          <Text style={{
            color: 'darkgray',
            fontSize: 13,
          }}>{new Date(item.created_at).toLocaleTimeString()}</Text>
        </View>
        <Text style={{
          color: 'white',
          marginTop: 2,
        }}>Sent you a friend request</Text>
        <View style={{
          flexDirection: 'row',
          gap: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 3.5,
        }}>
          <View style={{
            flexDirection: 'row',
            gap: 10,
          }}>
            <Button viber onPress={() => {
              
            }} loading={loading} title={'Decline'} style={{
              height: 35,
              width: 90,
              borderRadius: 12,
              backgroundColor: '#171717',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 0,
              color: 'tomato'
            }}/>
            
            <Button viber loading={loading} onPress={accept_req} title={'Accept'} style={{
              height: 35,
              width: 90,
              borderRadius: 12,
              backgroundColor: '#6a69fe',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 0,
            }}/>
          </View>
          
          <TouchableOpacity style={{
            height: 35,
            width: 35,
            borderRadius: 12,
            backgroundColor: '#1d1d1db9',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ellipsis size={20} color='white'/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RequestView;