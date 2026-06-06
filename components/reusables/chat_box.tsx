import Image from './Image';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import AppEvent, { Events } from '@/utils/eventEmitter'
import DateFormat from '@/utils/day'
import { storage } from '@/storage/mmkv'
import { socket } from '@/hooks/sockets/socket_provider';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { TimeHalfPassIcon } from '@hugeicons/core-free-icons';

export default function ChatBox({chat}) {
  const [unread_count, setUnreadCount] = useState(chat.unread_count || 0)
  let has_unread = unread_count >= 1
  const [content, setContent] = useState(chat.last_message_preview)
  const [timestamp, setTimeStamp] = useState(chat.last_message_at)
  const [sender_id, setSender_id] = useState(chat.last_message_sender_id)
  const { user } = JSON.parse(storage.getString('user'))
  const [vanish_enabled, setVanish_enabled] = useState(chat.msg_vanish_millis || 0)
  const [name, setName] = useState(chat.recipient_nickname || chat.recipient_name)
  
  useEffect(() => {
    console.log(chat.msg_vanish_millis)
    AppEvent.on(Events.MSG_SEND, (data) => {
      if (data.chat_id !== chat.id) return
      setContent(data?.content),
      setSender_id(data?.sender_id)
      setTimeStamp(data?.created_at)
      if(data.sender_id !== user.id) return setUnreadCount((prev) => typeof prev == 'number' && prev + 1)
    })
    AppEvent.on(Events.NICKNAME_CHANGE, (e) => {
      if(e.chat_id === chat.id) setName(e.newName)
    })
    AppEvent.on(Events.MSG_VANISH, (e) => {
      if(e.chat_id !== chat.id) return
      setVanish_enabled(e.duration)
    })
  }, [])
  
  return(
    <TouchableOpacity
      activeOpacity={.5}
      onPress={() => {
        has_unread = false
        setUnreadCount(0)
        router.push({
          pathname: '/pages/chat',
          params: {
            chat_id: chat?.id,
            chat_type: chat?.type,
            avatar: chat?.chat_avatar,
            name,
            recipient_id: chat?.recipient_id,
            msg_vanish_millis: vanish_enabled
          }
        })
      }
    }
    >
      <View style={styles.box}>
        <Image
          src={chat.chat_avatar}
          style={{
            width: 50,
            height: 50,
            borderRadius: 15,
          }}
        />
        
        <View className='flex-1 flex flex-col' style={styles.name_msg}>
          <Text className='text-white' 
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {name}
          </Text>
          <Text numberOfLines={1}
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '100%',
              fontWeight: !has_unread? 'normal' : 'bold',
              color: !has_unread? 'darkgray' : 'white',
            }}>
            {content? `${sender_id == user.id? 'You: ': `${chat?.recipient_name?.split(' ')[0]}: `}${content}` : 'Send a message'}
          </Text>
        </View>
        <View style={styles.controls}>
          <Text style={{
            fontWeight: !has_unread? 'normal' : 'bold',
            color: !has_unread? 'darkgray' : 'white',
            fontSize: 12,
            marginBottom: 4,
          }}>{DateFormat(timestamp * 1000, true)}</Text>
          <View style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            height: 20,
          }}>
            {vanish_enabled? <HugeiconsIcon icon={TimeHalfPassIcon} color='darkgray' size={15} strokeWidth={2}/> : null}
            <View style={{
              ...styles.badge,
              display: has_unread? undefined : 'none',
              width: unread_count >= 9? 28 : 20,
            }}><Text style={{
              color: 'white',
            }}>{unread_count}</Text></View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    color: 'white',
    padding: 13,
    paddingLeft: 11,
    paddingRight: 11,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 74,
   //borderWidth: 2,
    //borderColor: 'red',
  },
  
  name_msg: {
    marginLeft: 10,
    height: '92%',
    display: 'flex',
    justifyContent: 'space-between',
    //borderWidth: 2,
    //borderColor: 'red',
  },
  
  badge: {
    height: 20,
    borderRadius: 50, 
    backgroundColor: '#6a69fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  controls: {
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  }
})