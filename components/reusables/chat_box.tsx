import Image from './Image';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect, useContext } from 'react'
import AppEvent, { Events } from '@/utils/eventEmitter'
import DateFormat from '@/utils/day'
import { storage } from '@/storage/mmkv'
import { getDb } from '@/storage/db'
import { socket } from '@/hooks/sockets/socket_provider';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { TimeHalfPassIcon, TickDouble02Icon, Tick02Icon, Clock01Icon, NotificationOff01Icon, UnavailableIcon } from '@hugeicons/core-free-icons';
import { ChatContext } from '@/contexts/chatContext'

export default function ChatBox({chat}) {
  const chatContext = useContext(ChatContext)
  const [has_unread, setHasUnread] = useState(chat?.has_unread)
  const [content, setContent] = useState(chat?.last_message_preview)
  const [timestamp, setTimeStamp] = useState(chat?.last_message_at)
  const [last_sender_id, setLast_Sender_id] = useState(chat?.last_message_sender_id)
  const { user } = JSON.parse(storage.getString('user'))
  const [vanish_enabled, setVanish_enabled] = useState(chat?.msg_vanish_millis || 0)
  const [name, setName] = useState(chat?.recipient_nickname || chat?.recipient_name)
  const [bubble_color, setBubble_color] = useState(chat?.bubble_color)
  const [bg_uri, setBg_uri] = useState(chat?.bg_uri)
  const [brightness, setBrightness] = useState(chat?.brightness)
  const [last_msg_status, setlast_msg_status] = useState(chat?.last_message_status)
  const [last_message_id, setLas_message_id] = useState(chat?.last_message_id)
  const [isMuted, setIsMuted] = useState(chat?.muted)
  const [last_message_deleted, setLast_message_deleted] = useState(chat?.last_msg_deleted)
  
  const visibleIconStatus = {
    'Sending': <HugeiconsIcon icon={Clock01Icon} strokeWidth={1.8} size={16} color='darkgray'/>,
    'Sent':  <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={1.8} color='darkgray'/>,
    'Delivered': <HugeiconsIcon icon={TickDouble02Icon} size={18} strokeWidth={1.8} color='darkgray'/>,
    'Seen': <HugeiconsIcon icon={TickDouble02Icon} size={18} strokeWidth={1.8} color='#8484ff'/>,
    'Deleted': <HugeiconsIcon icon={UnavailableIcon} size={18} strokeWidth={1.8} color='darkgray'/>,
  }
  
  useEffect(() => {
    const handleMsgSend = (data) => {
      if (data.chat_id !== chat?.id) return;
      setLas_message_id(data.id);
      setContent(data?.content);
      setLast_Sender_id(data?.sender_id);
      setTimeStamp(data?.created_at);
      setlast_msg_status(data.status);
      setLast_message_deleted(data?.deleted)
      if (chatContext?.activeChatRoomId === chat?.id) return;
      if(data?.disable_ui_update) return 
      if (data.sender_id !== user?.id) setHasUnread(true);
    };
    
    const handleNicknameChange = (e) => {
      if (e.chat_id === chat?.id) setName(e.newName);
    };
    
    const handleLastChangeTimestamp = (e) => {
      if (e.message.chat_id !== chat?.id) return;
      setLas_message_id(e.message_id);
      setContent(e.message.content);
      setLast_Sender_id(e.message?.sender_id);
      setTimeStamp(e.message?.created_at);
      setlast_msg_status(e.message.status);
    };
    
    const handleMsgVanish = (e) => {
      if (e.chat_id !== chat?.id) return;
      setVanish_enabled(e.duration);
    };
    
    const handleMsgStatusUpdate = async (e) => {
      await new Promise((rslv) => setTimeout(rslv, 50));
      if (e.msg_id === last_message_id) setlast_msg_status(e.status);
    };
    
    const handleChatMuteUpdate = async (e) => {
      if (e.chat_id === chat.id) setIsMuted(e.value);
    };
    
    const handleUpdateMessage = (data) => {
      if(data.message_id !== last_message_id) return
      if(data?.command === 'delete') setLast_message_deleted(true)
      setContent(data.content)
    }
    
    AppEvent.on(Events.MSG_SEND, handleMsgSend);
    AppEvent.on(Events.NICKNAME_CHANGE, handleNicknameChange);
    AppEvent.on(Events.LAST_CHANGE_TIMESTAMP, handleLastChangeTimestamp);
    AppEvent.on(Events.MSG_VANISH, handleMsgVanish);
    AppEvent.on(Events.MSG_STATUS_UPDATE, handleMsgStatusUpdate);
    AppEvent.on(Events.MUTE_CHAT, handleChatMuteUpdate);
    AppEvent.on(Events.UPDATE_MESSAGE, handleUpdateMessage)
    
    return () => {
      AppEvent.off(Events.MSG_SEND, handleMsgSend);
      AppEvent.off(Events.NICKNAME_CHANGE, handleNicknameChange);
      AppEvent.off(Events.LAST_CHANGE_TIMESTAMP, handleLastChangeTimestamp);
      AppEvent.off(Events.MSG_VANISH, handleMsgVanish);
      AppEvent.off(Events.MUTE_CHAT, handleChatMuteUpdate);
      AppEvent.off(Events.MSG_STATUS_UPDATE, handleMsgStatusUpdate);
      AppEvent.off(Events.UPDATE_MESSAGE, handleUpdateMessage);
    };
  }, [chat?.id, chatContext?.activeChatRoomId, user?.id, last_message_id]);
  
  useEffect(() => {
    const handleThemeChange = (data) => {
      if (chat?.id !== data.chat_id) return;
      if (data?.bubble_color) setBubble_color(data.bubble_color);
      if (data?.bg_uri) setBg_uri(data.bg_uri);
      if (data?.brightness) setBrightness(data.brightness);
    };
    
    AppEvent.on(Events.CHAT_THEME_CHANGE, handleThemeChange);
    
    return () => {
      AppEvent.off(Events.CHAT_THEME_CHANGE, handleThemeChange);
    };
  }, [chat?.id]);

  
  const saveUnread = async () => {
    try {
      if(!has_unread) return
      const db = await getDb()
      await db.runAsync(`
        UPDATE chats
        SET has_unread = ?
        WHERE id = ?
      `, [false, chat.id])
    } catch (error) {
      console.error(error);
    }finally{
      setHasUnread(false)
    }
  }
  
  return(
    <TouchableOpacity
      activeOpacity={.5}
      onPress={() => {
        saveUnread()
        router.push({
          pathname: '/pages/chat',
          params: {
            chat_id: chat?.id,
            chat_type: chat?.type,
            avatar: chat?.chat_avatar,
            name,
            recipient_id: chat?.recipient_id,
            msg_vanish_millis: vanish_enabled,
            bg_uri,
            brightness,
            bubble_color: bubble_color || '#5E4BFA'
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
            borderRadius: 18,
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
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            maxWidth: '100%',
          }}>
            {last_sender_id === user?.id && visibleIconStatus[last_msg_status]}
            <Text numberOfLines={1} style={{
              overflow: 'hidden',
              maxWidth: '90%',
              fontStyle: last_message_deleted && 'italic',
              fontWeight: !has_unread? 'normal' : 'bold',
              color: !has_unread? 'darkgray' : 'white',
            }}>{content || (last_message_deleted? 'Message has been deleted!' : 'Tap to send message')}</Text>
          </View>
        </View>
        <View style={styles.controls}>
          <Text style={{
            fontWeight: !has_unread? 'normal' : 'bold',
            color: !has_unread? 'darkgray' : 'white',
            fontSize: 12,
            marginBottom: 4,
          }}>{DateFormat(timestamp || chat?.last_change_timestamp, true)}</Text>
          <View style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            height: 20,
          }}>
            {vanish_enabled? <HugeiconsIcon icon={TimeHalfPassIcon} color='darkgray' size={15} strokeWidth={2}/> : null}
            {isMuted? <HugeiconsIcon icon={NotificationOff01Icon} color='darkgray' size={15} strokeWidth={2}/> : null}
            <View style={{
              ...styles.badge,
              display: has_unread? undefined : 'none',
              width: 10,
            }}></View>
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
  },
  
  name_msg: {
    marginLeft: 10,
    height: '92%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  
  badge: {
    height: 10,
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