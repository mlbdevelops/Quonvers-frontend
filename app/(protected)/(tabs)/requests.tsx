import Image from '../../../components/reusables/Image';
import { View, Text, TouchableOpacity, Button, Alert, Modal, ActivityIndicator, FlatList, Pressable, Image as Img, RefreshControl, Dimensions } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { X, Ellipsis } from 'lucide-react-native'
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, UserMultipleIcon } from '@hugeicons/core-free-icons';
import Header from '@/components/header'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import trans from '@/hooks/fetch'
import { AuthContext } from '@/utils/authContext'
import dateFormat from '@/utils/day.js'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import TabSwitcher from '@/components/reusables/tabSwitcher'
import haptics from '@/hooks/haptics'
import ChatSkeleton from '@/components/skeletons/chat_skeleton'
import RequestView from '@/components/reusables/request/requestView'
import AppEvent, { Events } from '@/utils/eventEmitter'
import { getDb } from '@/storage/db';

const { height } = Dimensions.get('window');

export default function inbox(){
  const [requests, setRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const authContext = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [requestMode, setRequestMode] = useState(1)
  const { handleViber } = haptics()
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    (async () => {
      await getrequests()
    })()
  }, [])
  
  const onRefresh = useCallback( async () => {
    setRefreshing(true)
    await getrequests()
    setRefreshing(false)
  })
  
  useEffect(() => {
    AppEvent.on(Events.REQUEST_SUBMISSION, (data) => {
      if (!data) return;
      setRequests((prev) => prev.filter(r => r.user_id !== data.user_id))
    })
  }, [])
  
  
  const getrequests = async () => {
    if (!authContext.user.id) {
      return
    }
    return await getReqs()
    try {
      const res = await trans(`/api/requests/mine/get`, {
        method: 'GET',
        useToken: true
      })
      if (res.code == 904) {
        setRequests((prev) => [...res.data, ...prev].filter(r => r.sender_id !== authContext.user.id))
        setLoading(false)
        console.log(res);
      }
      if (res.code == 500) {
        toast('Server error, try again.')
        setLoading(false)
        console.log(res);
      }
      if (res.code == 404) {
        //toast(res.msg)
        setLoading(false)
        console.log(res);
      }
    } catch (err) {
      toast('Failed to load requests.')
      setLoading(false)
    }
    setLoading(false)
  }
  
  const getReqs = async () => {
    try {
      const db = await getDb()
      const getAllReqs = await db?.getAllAsync(`
        SELECT 
          u.user_id,
          u.name,
          u.username,
          u.avatar,
          m.chat_id,
          m.content,
          m.created_at
        FROM chats c
        JOIN messages m ON m.id = c.last_message_id
        JOIN users u ON u.user_id = m.sender_id
        WHERE c.status = 'pending'
        ORDER BY m.created_at DESC
      `)
      setRequests(getAllReqs)
      setLoading(false)
    } catch (error) {
      toast('Failed to load sent requests.')
      setLoading(false)
      console.error(error);
    }
  }
  
  const get_sent_reqs = async () => {
    if (!authContext.user.id) {
      return
    }
    try {
      const res = await trans(`/api/requests/sent/get`, {
        method: 'GET',
        useToken: true
      })
      if (res.code == 904) {
        setSentRequests((prev) => [...res.data, ...prev])
        setLoading(false)
        console.log(res);
      }
      if (res.code == 500) {
        toast('Server error, try again.')
        setLoading(false)
        console.log(res);
      }
      if (res.code == 404) {
        toast(res.msg)
        setLoading(false)
        console.log(res);
      }
    } catch (err) {
      toast('Failed to load sent requests.')
      setLoading(false)
    }
    setLoading(false)
  }
  
  const accept_req = async (itemId) => {
    setRequests((prev) => prev.filter(p => p.id !== itemId))
  }
  
  return(
    <View className='flex-1 bg-[#0a0a0a]'>
      <Toaster position='bottom'/>
      <Header title='Requests' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 25,
          alignItems: 'center',
        }}>
          <TouchableOpacity onPress={() => authContext.logOut()}>
            <Image avatar style={{
              height: 26,
              width: 26,
            }}/> 
          </TouchableOpacity>
        </View>
      }/>
      <View style={{
        width: '100%',
        padding: 10,
        gap: 10,
        flex: 1,
        paddingVertical: 5,
      }}>
        <TabSwitcher
          onChange={({index}) => setRequestMode(index + 1)}
          options={['Request','Accepted','Sent']}
        />
        
        <FlatList 
          data={requests}
          ListEmptyComponent={<Empty requestMode={requestMode}/>}
          keyExtractor={(item) => item.user_id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              progressBackgroundColor='#1d1d1d'
              colors={['white']}
              refreshing={refreshing} 
              onRefresh={onRefresh}
            />
          }
          style={{
            width: '100%',
            flex: 1,
          }}
          renderItem={({ item, index }) => (
            <RequestView
              key={index}
              item={item} 
              isLast={item.id === requests[requests.length - 1].id} 
              //onDecline={decline_req}
            />
          )}
        />
        {loading && 
          <View style={{
            height: '100%',
            width: '100%',
          }}>
            <ChatSkeleton/>
            <ChatSkeleton/>
            <ChatSkeleton/>
            <ChatSkeleton/>
            <ChatSkeleton/>
          </View>
        }
      </View>
    </View>
  )
}


const Empty = ({requestMode}) => {
  return(
    <View style={{
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      //backgroundColor: 'red',
      gap: 5,
      //backgroundColor: 'red',
      flex: 1,
      marginTop: height / 3.7,
    }}>
      {/*<Img style={{
        height: 200,
        width: 200,
        borderRadius: 50,
        //backgroundColor: 'white',
      }} source={require('../../../assets/no_results/no_results_5.jpg')}/>*/}
      <HugeiconsIcon icon={UserMultipleIcon} size={100} color='white'/>
      <Text style={{
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
      }}>No request found!</Text>
      <Text style={{
        //fontSize: 13,
        color: 'darkgray',
      }}>{requestMode == 1? 'Your requests will appear here.' : requestMode == 2? 'Accepted requests will appear here.' : requestMode == 3? 'Sent requests will appear here.' : null}</Text>
    </View>
  )
}