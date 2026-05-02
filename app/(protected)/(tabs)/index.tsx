import Image from '@/components/reusables/Image';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image as Img, RefreshControl, Alert, Modal } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { getDb } from '@/storage/db';
import { storage } from '@/storage/mmkv';
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, MenuIcon, UserCircleIcon, MailIcon, AddIcon, WifiOffIcon, Chat01Icon } from '@hugeicons/core-free-icons';
import haptics from '../../../hooks/haptics.js'
import Header from '@/components/header'
import ChatBox from '@/components/reusables/chat_box'
import ChatSkeleton from '@/components/skeletons/chat_skeleton'
import Snap from '@/components/reusables/snap'
import { ChevronRight, Edit, Ellipsis } from 'lucide-react-native'
import trans from '@/hooks/fetch'
import { useState, useEffect, useCallback } from 'react'
import userContext from '@/hooks/useUser'
import { useCustomAlert } from '@/hooks/alert'
import { router } from 'expo-router'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import { socket } from '@/hooks/sockets/socket_provider';
import { localMsgStore } from '@/utils/MessageServices/index'
import { MessageStatus } from '@/utils/MessageServices'

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
  
  const onRefresh = useCallback( async () => {
    setRefreshing(true)
    await getChats()
    setRefreshing(false)
  })
  
  useEffect(() => {
    socket.on('message:receive', async (msg) => {
      //console.log(msg.chat_id);
      await localMsgStore({
        id: msg.id,
        chat_id: msg.chat_id,
        sender_id: msg.sender_id,
        content : msg.content,
        type: msg.type,
        media_url : msg.media_url,
        attachments: msg.attachments || [],
        reply_to : msg.reply_to,
        disappears_at : msg.disappears_at,
        created_at: msg.created_at
      }, false)
      
      socket.emit('message:delivered', {msg_id: msg.id, toUser: msg.sender_id, at: Date.now(), status: 'Delivered'})
    })
    socket.on('message:status', async (data) => {
      await MessageStatus(data.msg_id, data.status, data.at)
    })
    return () => socket.disconnect()
  }, [])
  
  const getChatsFromDb = async () => {
    const db = await getDb();
    //return save_chats_locally()
    const chats = await db?.getAllAsync(`  
      SELECT  
        c.id,  
        u.name AS recipient_name,  
        u.avatar AS chat_avatar,  
        r.user_id AS recipient_id,  
        r.nickname AS recipient_nickname,  
        mc.muted AS isMuted,  
        c.last_message_id,  
        c.last_message_preview,  
        c.last_message_at,  
        c.last_message_sender_id,  
        c.created_at,  
        c.read_receipts,  
        c.pinned_at,  
        c.archived,
        mc.unread_count
      FROM chats c  
      JOIN chat_members r ON r.chat_id = c.id  
      JOIN chat_members mc ON mc.chat_id = c.id  
      JOIN users u ON u.user_id = r.user_id  
      WHERE  
        r.user_id != ?  -- Find the "other" person
        AND mc.user_id = ?  -- Ensure "I" am in the chat
      GROUP BY c.id  
      ORDER BY c.pinned_at DESC, c.last_message_at DESC
    `, [user.id, user.id]);
    //console.log(chats);
    setChats([...new Set([...chats])])
    setLoading(false)
  };
  
  const getChats = async () => {
    try {
      setLoading(true)
      //await getChatsFromDb()
      const res = await trans('/api/chat/get_chat_list', {
        useToken: true,
        method: 'GET',
        errMSg: 'Failed to load chats, please retry'
      })
      if (res.code == 200 && res.data) {
        setChats((prev) => {
          const newChats = [...prev, ...res.data]
          return newChats
        })
      }
      setLoading(false)
      setNetworkProbs(false)
    } catch (error) {
      setLoading(false)
      toast('Failed to load chats, please retry')
      console.log(error);
      setNetworkProbs(true)
    }
  }
  
  const save_chats_locally = async () => {
    const db = await getDb()
    const logc = await db.getAllAsync(`
      DROP TABLE messages
    `,[])
    const log = await db.getAllAsync(`
      DROP TABLE chats
    `,[])
    console.log(logc);
  }
  
  useEffect(() => {
    ( async () => {
      await getChats()
    })()
  }, [])
  
  return(
    <View className='flex-1 bg-[#0a0a0a] flex items-center'
    >
      <Modal visible={showModal} presentationStyle='pageSheet' onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity onPress={() => setShowModal(false)}><Text>Close</Text></TouchableOpacity>
      </Modal>
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
          <TouchableOpacity onPress={() => getChats()}>
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
       
        {/*<View style={{
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: 15,
            paddingBottom: 0,
            //borderWidth: 2,
            //borderColor: 'red',
          }}>
          {<View style={{
            //display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            //borderWidth: 2,
            //borderColor: 'red'
          }}>
            <Text style={{
              fontWeight: 'bold',
              color: 'white',
              opacity: 0,
            }}>Friends snaps</Text>
            <TouchableOpacity style={{
              opacity: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}><Text style={{
              color: '#6a69fe',
            }}>View more</Text></TouchableOpacity>
          </View>}
          
          {chats.length > 0 && 
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              width: '92%',
              paddingTop: 20,
              paddingBottom: 0,
              gap: 10,
              flex: 1,
            }}>
              <Snap/>
              <Snap/>
              <Snap/>
            </View>
          }
        </View> */}
        
        <View style={{
          //height: 20,
          //backgroundColor: 'red',
          flexDirection: 'row',
          gap: 10,
          marginTop: 17,
          width: '92%',
        }}>
          <TouchableOpacity onPress={async() => {
            setSectionIndex(0)
            await handleViber.Medium()
          }} style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: !sectionIndex? 'rgba(106,105,254,0.117)' : '#1d1d1d',
            paddingVertical: 5,
            paddingHorizontal: 13,
            borderRadius: 50,
          }}>
            <Text style={{
              color: !sectionIndex? '#6a69fe' : 'darkgray',
            }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ async () => {
            setSectionIndex(1)
            await handleViber.Medium()
          }} style={{
            alignItems: 'center',
            backgroundColor: sectionIndex == 1? 'rgba(106,105,254,0.117)' : '#1d1d1d',
            borderRadius: 50,
            padding: 5,
            paddingVertical: 5,
            paddingHorizontal: 13,
            justifyContent: 'center',
          }}>
            <Text style={{
              color: sectionIndex == 1? '#6a69fe' : 'darkgray',
            }}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async() => {
            setSectionIndex(2)
            await handleViber.Medium()
          }} style={{
            backgroundColor: sectionIndex == 2? 'rgba(106,105,254,0.117)' : '#1d1d1d',
            borderRadius: 50,
            alignItems: 'center',
            padding: 5,
            paddingVertical: 5,
            paddingHorizontal: 13,
            justifyContent: 'center',
          }}>
            <Text style={{
              color: sectionIndex == 2? '#6a69fe' : 'darkgray',
            }}>Unread</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async() => {
            setSectionIndex(3)
            await handleViber.Medium()
          }} style={{
            backgroundColor: sectionIndex == 3? 'rgba(106,105,254,0.117)' : '#1d1d1d',
            borderRadius: 50,
            alignItems: 'center',
            padding: 5,
            paddingVertical: 5,
            paddingHorizontal: 13,
            justifyContent: 'center',
          }}>
            <Text style={{
              color: sectionIndex == 3? '#6a69fe' : 'darkgray',
            }}>Channel</Text>
          </TouchableOpacity>
        </View>
        
        <View
          style={{
            flex: 1,
            minHeight: '75%',
            paddingLeft: 3,
            paddingRight: 3,
            width: '100%',
            marginTop: 10,
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