import Image from '../../../components/reusables/Image';
import { View, Text, TouchableOpacity, Button, Alert, Modal, ActivityIndicator, FlatList, Pressable, Image as Img, RefreshControl } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { X, Ellipsis } from 'lucide-react-native'
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, UserMultipleIcon } from '@hugeicons/core-free-icons';
import Header from '@/components/header'
import { useState, useEffect, useContext, useCallback } from 'react'
import trans from '@/hooks/fetch'
import { AuthContext } from '@/utils/authContext'
import dateFormat from '@/utils/day.js'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import haptics from '@/hooks/haptics'
import ChatSkeleton from '@/components/skeletons/chat_skeleton'
import RequestView from '@/components/reusables/request/requestView'

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
  
  const getrequests = async () => {
    if (!authContext.user.id) {
      return
    }
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
        gap: 20,
        flex: 1,
        paddingVertical: 5,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          borderRadius: 50,
          height: 40,
          backgroundColor: '#1d1d1db9',
          padding: 4,
          //borderWidth: 1,
          //borderColor: '#262626',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity onPress={ async () => { 
            await setRequestMode(1)
            await handleViber.Medium()
          }} style={{
            height: '100%',
            width: '33%',
            borderRadius: 50,
            backgroundColor: requestMode == 1? 'white' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              color: requestMode == 1? 'black' : 'white',
            }}>Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ async () => {
            await setRequestMode(2)
            await handleViber.Medium()
          }} style={{
            height: '100%',
            width: '33%',
            borderRadius: 50,
            backgroundColor: requestMode == 2? 'white' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              color: requestMode == 2? 'black' : 'white',
            }}>Accepted</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ async () => {
            await setRequestMode(3)
            await handleViber.Medium()
          }} style={{
            height: '100%',
            width: '33%',
            borderRadius: 50,
            backgroundColor: requestMode == 3? 'white' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              color: requestMode == 3? 'black' : 'white',
            }}>Sent</Text>
          </TouchableOpacity>
        </View>
        
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
        
        <FlatList 
          data={requests}
          keyExtractor={(item) => item.id}
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
              onSubmit={(id) => accept_req(id)}
              //onDecline={decline_req}
            />
          )}
        />
      </View>
      {!loading && !requests.length && <View style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red',
        gap: 5
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
      </View>}
    </View>
  )
}
