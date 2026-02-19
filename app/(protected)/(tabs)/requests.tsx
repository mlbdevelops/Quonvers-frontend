import { View, Text, TouchableOpacity, Button, Alert, Modal, ActivityIndicator, Image, FlatList, Pressable } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { X } from 'lucide-react-native'
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, UserCircleIcon } from '@hugeicons/core-free-icons';
import Header from '@/components/header'
import { useState, useEffect, useContext } from 'react'
import trans from '@/hooks/fetch'
import { AuthContext } from '@/utils/authContext'
import dateFormat from '@/utils/day.js'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import haptics from '@/hooks/haptics'

export default function inbox(){
  const [notifs, setNotifs] = useState([])
  const [sentReqs, setSentReqs] = useState([])
  const authContext = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [requestMode, setRequestMode] = useState(1)
  const { handleViber } = haptics()
  
  useEffect(() => {
    (async () => {
      await getNotifs()
    })()
  }, [])
  
  const getNotifs = async () => {
    if (!authContext.user.id) {
      return
    }
    try {
      const res = await trans(`/api/requests/mine/get`, {
        method: 'GET',
        useToken: true
      })
      if (res.code == 904) {
        setNotifs((prev) => [...res.data, ...prev])
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
      toast('Something bad happened, check your network connection and try again.')
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
        setNotifs((prev) => [...res.data, ...prev])
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
      toast('Something bad happened, check your network connection and try again.')
      setLoading(false)
    }
    setLoading(false)
  }
  
  const accept_req = async (receiver, sender, id) => {
    try {
      const accept = await trans('/api/chat/createConversation', {
        headers: {
          'Content-Type' : 'application/json'
        },
        body: { sender, receiver }
      })
      if (accept.code == 904) {
        toast('Request accepted ✓')
        setNotifs((prev) => prev.filter(n => n.id !== id))
      }
    } catch (err) {
      toast('Something went wrong, try again.')
    }
  }
  
  return(
    <View className='flex-1 bg-[#0a0a0a]'>
      <Toaster/>
      <Header title='Requests' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 16
        }}>
          <TouchableOpacity onPress={() => authContext.logOut()}>
            <HugeiconsIcon color='white' icon={UserCircleIcon} strokeWidth={1.8}/>
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
          backgroundColor: '#262626',
          padding: 3,
          //borderWidth: 1,
          //borderColor: '#262626',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity onPress={ async () => { 
            await handleViber.Medium()
            setRequestMode(1)
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
            }}>Requests ({notifs.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ async () => {
            await handleViber.Medium()
            setRequestMode(2)
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
            await handleViber.Medium()
            setRequestMode(3)
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
          <ActivityIndicator 
            size={'large'} 
            color='white' 
          />
        }
        
        <FlatList 
          data={notifs}
          keyExtractor={(item) => item.id}
          style={{
            width: '100%',
            flex: 1,
          }}
          renderItem={({ item }) => (
            <View onPress={() => accept_req(item.receiver_id, item.sender_id, item.id)} style={{
              //borderWidth: 1,
              //borderColor: '#1d1d1db9',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              justifyContent: 'space-between',
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}>
                <Image source={item.sender_avatar? { uri: item.sender_avatar } : require('../../../assets/images/no_profile.png')} style={{
                  height: 45, 
                  width: 45,
                  borderRadius: 50,
                  //backgroundColor: '#262626',
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}/>
                <View style={{
                  gap: 2,
                }}>
                  <View style={{
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'flex-end',
                  }}>
                    <Text style={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: 16,
                    }}>{item.sender_name}</Text>
                    <Text style={{
                      color: 'darkgray',
                      fontSize: 13,
                    }}>{dateFormat(item.created_at)}</Text>
                  </View>
                  <Text style={{
                    color: 'white',
                  }}>Sent you a request</Text>
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
              }}>
                <TouchableOpacity onPress={() => accept_req(item.receiver_id, item.sender_id, item.id)} style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#6a69fe',
                  borderRadius: 13,
                  padding: 10,
                  paddingVertical: 8,
                  height: 35,
                  width: 80,
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 13,
                    //padding: 10,
                  }}>Accept</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => null} style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#262626',
                  borderRadius: 13,
                  padding: 10,
                  paddingVertical: 8,
                  height: 35,
                  width: 35,
                }}>
                  <X color='white' size={15}/>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      {/*<Button onPress={getNotifs} title='Get your notifications'/>*/}
    </View>
  )
}
