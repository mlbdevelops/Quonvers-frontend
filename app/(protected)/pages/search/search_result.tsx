import Image from '../../../../components/reusables/Image';
import React, { useContext, useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import trans from '@/hooks/fetch'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, TouchableHighlight, Pressable } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SearchIcon, Mic02Icon, FavouriteIcon, UserIcon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import { AuthContext } from '@/utils/authContext'
import { v4 as uuidv4 } from 'uuid'

const SearchValue = () => {
  const authContext = useContext(AuthContext)
  const { value } = useLocalSearchParams()
  const [query, setQuery] = useState([])
  const [queryIndex, setQueryIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [noUser, setNoUser] = useState(false)
  
  const search = async () => {
    try {
      const res = await trans(`/api/search/user/${value}/${authContext.user.id}`, {method: 'GET'})
      console.log('undefined => ', res);
      if (res?.code == 200) {
        setQuery(res.users)
      }
      if (res?.code == 809) {
        setNoUser(true)
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  const send_req = async (receiver_id) => {
    try {
      if (!receiver_id && !authContext.user) {
        return
      }
      const res = await trans('/api/users/friends/request', {
        body: {
          sender: authContext.user.id,
          receiver: receiver_id,
        },
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      
      if (res.code == 902) {
        toast('Request sent')
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  React.useEffect(() => {
    if (value) {
      search()
    }
  }, [value])
  
  return (
    <View style={styles.container}>
      <Toaster/>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: 15,
        justifyContent: 'space-between',
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={'white'}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            borderWidth: 0,
            color: 'white',
            flex: 1,
            borderRadius: 50,
            backgroundColor: '#1d1d1d',
            paddingHorizontal: 13,
            height: 35,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10
          }}
        >
          <HugeiconsIcon color='white' icon={SearchIcon} size={20}/>
          <Text style={{
            color: 'white',
          }}>{value}</Text>
        </TouchableOpacity>
      </View>
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 15
      }}>
        <TouchableOpacity onPress={() => setQueryIndex(1)} style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          padding: 10,
          borderRadius: 50,
          backgroundColor: queryIndex == 1? 'white' : '#1d1d1d',
          paddingVertical: 5,
        }}>
          
          <Text style={{
            color: queryIndex == 1? 'black' : 'white'
          }}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setQueryIndex(2)} style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          padding: 10,
          borderRadius: 50,
          backgroundColor: queryIndex == 2? 'white' : '#1d1d1d',
          paddingVertical: 5,
        }}>
          
          <Text style={{
            color: queryIndex == 2? 'black' : 'white'
          }}>Moments</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setQueryIndex(3)} style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          padding: 10,
          borderRadius: 50,
          backgroundColor: queryIndex == 3? 'white' : '#1d1d1d',
          paddingVertical: 5,
        }}>
          
          <Text style={{
            color: queryIndex == 3? 'black' : 'white'
          }}>chat mates</Text>
        </TouchableOpacity>
      </View>
      <View style={{
        //flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 300,
        padding: 15,
        paddingVertical: 20,
        gap: 15
      }}>
        {value && <Text style={{
          color: 'white',
          //fontWeight: 'bold',
          //margin: 5,
          marginVertical: 0,
          alignSelf: 'flex-start',
          fontSize: 15,
        }}>Results for <Text style={{
          color: '#6a69fe',
          fontWeight: 'bold',
        }}>{value}</Text> </Text>}
        {noUser? <Text style={{
          color: 'white',
          marginTop: 250,
          fontWeight: 'bold',
        }}>No user found!</Text> : null}
        
        {query.map((item, i) => (
          <Pressable onPress={() => {
            router.push({
              pathname: '/pages/chat',
              params: {
                chat_id: uuidv4(),
                chat_type: 'private',
                avatar: item.avatar,
                name: item.name,
                recipient_id: item.id,
                sender_data: JSON.stringify({
                  id: item.id,
                  avatar: item.avatar,
                  name: item.name,
                  username: item.username
                })
              }
            })
            
            /*router.push({
              pathname: '/pages/profiles/other',
              params: { 
                user: JSON.stringify(item)
              }
            })*/
          }} key={i} style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
            <View style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}>
              <Image style={{
                height: 50,
                width: 50,
              }} src={item.avatar}/>
              <View style={{
                flexDirection: 'column',
                gap: 2,
              }}>
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>{item.name}</Text>
                <Text style={{
                  color: 'darkgray',
                }}>@{item.username}</Text>
              </View>
            </View>
            <Pressable onPress={() => send_req(item.id)} style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 13,
              padding: 10,
              paddingVertical: 8,
              display: 'none',
            }}>
              <Text style={{
                color: 'black',
                fontSize: 13,
                //padding: 10,
              }}>Add friend</Text>
            </Pressable>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});

export default SearchValue;