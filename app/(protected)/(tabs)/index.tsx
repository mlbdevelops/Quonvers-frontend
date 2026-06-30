import Image from '@/components/reusables/Image';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image as Img, RefreshControl, Alert, Modal } from 'react-native'
import { getDb } from '@/storage/db';
import { storage } from '@/storage/mmkv';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, MenuIcon, UserCircleIcon, MailIcon, AddIcon, WifiOffIcon, Chat01Icon } from '@hugeicons/core-free-icons';
import haptics from '@/hooks/haptics.js'
import Header from '@/components/header'
import ChatBox from '@/components/reusables/chat_box'
import ChatSkeleton from '@/components/skeletons/chat_skeleton'
import Snap from '@/components/reusables/snap'
import { ChevronRight, Edit, Ellipsis } from 'lucide-react-native'
import trans from '@/hooks/fetch'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import userContext from '@/hooks/useUser'
import { useCustomAlert } from '@/hooks/alert'
import { router } from 'expo-router'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import { socket } from '@/hooks/sockets/socket_provider';
import { localMsgStore } from '@/utils/MessageServices/index'
import { MessageStatus } from '@/utils/MessageServices'
import { createChat } from "@/utils/MessageServices/CreateChat"
import { UpdateMessage } from "@/utils/MessageServices/UpdateMessage"
import PushNotif from '@/utils/notifications'
import TabSwitcher from '@/components/reusables/tabSwitcher'
import SetChatDisapearsAtSetting from '@/utils/commands/MessageVanish'
import SetDisapearsAt from '@/utils/commands/UpdateMessageExpiry'
import chatContext from '@/hooks/chatContext'
export default function messagesScreen(){
  const { handleViber } = haptics()
  const [chats, setChats] = useState([])
  const [sectionIndex, setSectionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const alert = useCustomAlert()
  const [showModal, setShowModal] = useState(false)
  const { user } = userContext()
  const [networkProbs, setNetworkProbs] = useState(false)
  const messageQueue = useRef([]);
  const isProcessing = useRef(false);
  const commandQueue = useRef([])
  const isCommandQueueProcessing = useRef(false)
  const statusQueue = useRef([])
  const isStatusProcessing = useRef(false)
  const messageCommands = useRef([])
  const messageCommandsIsProcessing = useRef(false)
  
  const onRefresh = useCallback( async () => {
    try {
      setRefreshing(true)
      await getChats()
    } catch (error) {
      console.error(error);
    }finally{
      setRefreshing(false)
    }
  })
  
  useEffect(() => {
    const processQueue = async () => {
      isProcessing.current = true;
      
      try {
        const db = await getDb();
        let msg;
        while ((msg = messageQueue.current.shift())) {
          if (!msg) continue;
          
          const senderId = msg?.sender_id;
          
          const existingMember = await db.getFirstAsync(
            'SELECT chat_id FROM chat_members WHERE user_id = ?',
            [senderId]
          );
          
          const finalChatId = existingMember?.chat_id ?? msg?.chat_id;
          
          if (!existingMember?.chat_id) {
            let userData = msg.sender_data;
            if (!userData) {
              const response = await trans(`/api/_/get_user?user_id=${senderId}`, {
                useToken: true, method: 'GET',
              });
              userData = response.data;
            }
            await createChat({ ...userData, msg_id: msg.id }, finalChatId, 'pending');
          }
          await localMsgStore({ 
            chat_id: finalChatId,
            sender_id: senderId,
            ...msg, 
          }, chatContext?.activeChatRoomId);
          //await PushNotif('New message', msg.content)
          socket.emit('message:delivered', {
            msg_id: msg.id, toUser: senderId, at: Date.now(), status: 'Delivered',
          });
        }
      } catch (error) {
        console.error("Queue Processing Error:", error);
      } finally {
        isProcessing.current = false;
        if (messageQueue.current.length > 0) {
          processQueue();
        }
      }
    };
    
    const handleMessage = (msg) => {
      messageQueue.current.push(msg);
      if (!isProcessing.current) processQueue();
    };
    
    socket.on('message:receive', handleMessage);
    return () => socket.off('message:receive', handleMessage);
  }, []);
  
  useEffect(() => {
    const processCommandQueue = async () => {
      isCommandQueueProcessing.current = true
      const db = await getDb()
      try {
        let c
        while((c = commandQueue.current.shift())){
          if(!c.type) continue
          c.type === 'message_vanish' && await SetChatDisapearsAtSetting(c)
        }
      } catch (error) {
        console.error(error);
      }finally{
        isCommandQueueProcessing.current = false;
        if (commandQueue.current.length > 0) {
          processCommandQueue();
        }
      }
    }
    
    const handleCommands = (c) => {
      commandQueue.current.push(c)
      if(!isCommandQueueProcessing.current) processCommandQueue()
    }
    
    socket.on('command:receive', handleCommands)
  }, [])
  
  useEffect(() => {
    const handleStatus = async () => {
      isStatusProcessing.current = true
      let status
      while((status = statusQueue.current.shift())){
        try {
          await MessageStatus(status.msg_id, status.status, status.at);
          SetDisapearsAt(status.msg_id)
        } catch (e) {
          console.error("Status Update Error:", e);
        }finally{
          isStatusProcessing.current = false
          if(statusQueue.current.length > 0) handleStatus()
        }
      }
    };
    
    const addToQueue = async (status) => {
      statusQueue.current.push(status)
      if(!isStatusProcessing.current) handleStatus()
    }
    socket.on('message:status', addToQueue);
  }, []);
  
  useEffect(() => {
    const processMsgCommands = async () => {
      messageCommandsIsProcessing.current = true
      try {
        let mcommand
        while((mcommand = messageCommands.current.shift())){
          await UpdateMessage(mcommand)
        }
      } catch (error) {
        console.error(error);
      }finally{
        messageCommandsIsProcessing.current = false
        if(messageCommands.current.length > 0) processMsgCommands()
      }
    }
    
    const addToQueue = (data) => {
      messageCommands.current.push(data)
      if(!messageCommandsIsProcessing.current) processMsgCommands()
    }
    socket.on('deleteMessage:foreveryone:receive', addToQueue)
  }, [])
  
  
  const getMsgs = async () => {
    const db = await getDb()
    const dm = await db.getAllAsync(`
      SELECT disappears_at
      FROM messages
      WHERE disappears_at <= ?
    `, [Date.now()])
    console.log(dm)
  }
  
  const getChatsFromDb = async () => {
    const db = await getDb();
    // mc = my chat
    // r = recipient
    // c = chat
    // m = message
    // dm = disappearing message
    // ct = chat theme
    // u = user
    const chats = await db?.getAllAsync(`  
      SELECT  
        c.id,  
        u.name AS recipient_name,  
        u.avatar AS chat_avatar,  
        r.user_id AS recipient_id,  
        r.nickname AS recipient_nickname,  
        c.muted AS isMuted,  
        c.last_message_id,  
        m.content AS last_message_preview,  
        m.created_at AS last_message_at,  
        m.sender_id AS last_message_sender_id,
        m.status AS last_message_status,
        m.deleted AS last_msg_deleted,
        c.created_at,
        c.pinned,
        c.archived,
        dm.disappearing_millisecs AS msg_vanish_millis,
        ct.bubble_color,
        ct.bg_uri,
        ct.bg_opacity AS brightness,
        c.has_unread,
        c.muted,
        c.last_change_timestamp
      FROM chats c  
      JOIN chat_members r ON r.chat_id = c.id  
      JOIN chat_members mc ON mc.chat_id = c.id  
      JOIN users u ON u.user_id = r.user_id  
      LEFT JOIN disappear_setting dm ON dm.chat_id = c.id
      LEFT JOIN chat_theme ct ON ct.chat_id = c.id
      LEFT JOIN messages m ON m.id = c.last_message_id
      WHERE  
        r.user_id != ?
        AND mc.user_id = ?
        AND c.status = 'accepted'
      GROUP BY c.id  
      ORDER BY c.last_message_at DESC
    `, [user.id, user.id]);
    setChats([...new Set([...chats])])
  };
  
  const getChats = async () => {
    try {
      setLoading(true)
      await getChatsFromDb()
    } catch (error) {
      setLoading(false)
      toast('Failed to load chats, please retry')
      console.log(error);
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(() => {
    ( async () => {
      await getChats()
    })()
  }, [])
  
  return(
    <View className='flex-1 bg-[#0a0a0a] flex items-center'>
      <Toaster position={'bottom'}/>
      <View style={{
        height: 50,
        width: 50,
        borderRadius: '50%',
        backgroundColor: '#6a69fe' || '#493168',
        position: 'absolute',
        right: 20,
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}><HugeiconsIcon icon={AddIcon} color='white' /></View>
      <Header title='Chats' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 25,
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            onPress={ async () => {
              await handleViber.Medium()
            }}
            style={{
              padding: 2,
              backgroundColor: '',
              borderRadius: 50,
              borderWidth: 1.5,
              borderColor: 'white',
            }}>
            <Ellipsis size={20} color='white'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getMsgs()}>
            <Image avatar style={{
              height: 26,
              width: 26,
            }}/> 
          </TouchableOpacity>
        </View>
      }/>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl progressBackgroundColor='#1d1d1d' colors={['white']}  refreshing={refreshing} onRefresh={onRefresh}/>
      } contentContainerStyle={{
        alignItems: 'center',
      }} style={{
        flex: 1,
        width: '100%',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#1d1d1d',
            width: '92%',
            //padding: 11.5,
            height: 40,
            //justifyContent: 'center',
            paddingHorizontal: 11.5,
            alignItems: 'center',
            gap: 8,
            borderRadius: 15,
          }} 
          onPress={async () => await handleViber.Medium()}
          className='flex-row '>
          <HugeiconsIcon size={20} color='darkgray' icon={SearchIcon} stroke={1.8}/>
          <Text style={{
            color: 'darkgray',
            fontSize: 16,
            fontWeight: '400',
          }}>Search...</Text>
        </TouchableOpacity>
        <TabSwitcher 
          activeBg={'#6a69fe'}
          inactiveBg={'#1d1d1d'}
          itemStyle={{
            borderRadius: 100,
            height: '75%',
            flex: null,
            paddingHorizontal: 12,
            borderBottomWidth: 0
          }}
          style={{
            justifyContent: null,
            marginHorizontal: 15,
            width: '92%',
            marginTop: 10,
            gap: 12
          }}
          options={['Messages', 'Unread', 'Favorite']}
        />
        <View
          style={{
            flex: 1,
            minHeight: '75%',
            paddingLeft: 3,
            paddingRight: 3,
            width: '100%',
            //marginTop: 5,
            marginBottom: chats.length && 50,
          }}
        >
          {chats.length > 0 && chats.map((c, i) => (
            <ChatBox chat={c} key={i}/>
          ))}
          {!loading && !chats.length && <View style={{
            flex: 1,
            //backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}>
            <HugeiconsIcon icon={Chat01Icon} size={100} color='white'/>
            <Text style={{
              fontSize: 25,
              color: 'white',
              fontWeight: 'bold',
            }}>No chats found!</Text>
            <Text style={{
              fontSize: 14,
              color: 'darkgray',
            }}>Your chats will appear here.</Text>
            <TouchableOpacity onPress={() => {
              router.push('/(protected)/feed')
              //setShowModal(true)
            }} style={{
              width: 120,
              height: 40,
              borderRadius: 50,
              backgroundColor: 'white',
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              justifyContent: 'center',
              paddingRight: 5,
            }}>
              <HugeiconsIcon icon={AddIcon} color='black' size={20}/>
              <Text style={{
                color: 'black',
                fontWeight: 'semi-bold',
              }}>Discover</Text>
            </TouchableOpacity>
          </View>}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
          {loading? <ChatSkeleton/> : null}
        </View>
      </ScrollView>
    </View>
  )
}