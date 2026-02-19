import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, MenuIcon, UserCircleIcon } from '@hugeicons/core-free-icons';
import haptics from '../../../hooks/haptics.js'
import Header from '@/components/header'
import ChatBox from '@/components/reusables/chat_box'
import ChatSkeleton from '@/components/skeletons/chat_skeleton'
import Snap from '@/components/reusables/snap'
import { ChevronRight, Edit } from 'lucide-react-native'
import trans from '@/hooks/fetch'
import { useState, useEffect } from 'react'

export default function messagesScreen(){
  const { handleViber } = haptics()
  const [chats, setChats] = useState([])
  
  useEffect(() => {
    ( async () => {
      const res = await trans('/api/chat/get_chat_list', {
        useToken: true,
        method: 'GET'
      })
      console.log(res);
      if (res.code == 200 && res.data) {
        setChats(res.data)
      }
    })()
  }, [])
  
  return(
    <View className='flex-1 bg-[#0a0a0a] flex items-center'
    >
      <Header title='Chats' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 16
        }}>
          <TouchableOpacity>
            <HugeiconsIcon color='white' icon={MenuIcon} strokeWidth={1.8}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <HugeiconsIcon color='white' icon={UserCircleIcon} strokeWidth={1.8}/>
          </TouchableOpacity>
        </View>
      }/>
      
      <ScrollView style={{
        flex: 1,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#1d1d1d',
            width: '92%',
            padding: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderRadius: 50,
            alignSelf: 'center',
          }} 
          onPress={async () => await handleViber.Medium()}
          className='flex-row '>
          <HugeiconsIcon size={18} color='darkgray' icon={SearchIcon} stroke={1.8}/>
          <Text style={{
            color: 'darkgray'
          }}>Search...</Text>
        </TouchableOpacity>
       
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: 15,
            paddingBottom: 0,
            //borderWidth: 2,
            //borderColor: 'red',
          }}>
          <View style={{
            display: 'flex',
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
            }}>Friends snaps</Text>
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}><Text style={{
              color: '#6a69fe',
            }}>View more</Text></TouchableOpacity>
          </View>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
            paddingTop: 10,
            paddingBottom: 0,
            gap: 10
          }}>
            <Snap/>
            <Snap/>
            <Snap/>
          </View>
        </View> 
        
        
        <View
          style={{
            paddingLeft: 3,
            paddingRight: 3,
            width: '100%',
            marginTop: 10,
            marginBottom: 50,
            flex: 1,
          }}
        >
          <ChatBox/>
          <ChatBox/>
          <ChatBox/>
          <ChatBox/>
          <ChatBox/>
          <ChatBox/>
          <ChatSkeleton/>
          <ChatSkeleton/>
          {/*<ActivityIndicator visible={false} size='large' color='#6a69fe'/>*/}
        </View>
      </ScrollView>
    </View>
  )
}