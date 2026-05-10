import Image from '../Image';
import Button from '../button';
import React from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList, Pressable, Image as Img } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { X, Ellipsis } from 'lucide-react-native'
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, UserCircleIcon } from '@hugeicons/core-free-icons';
import haptics from '@/hooks/haptics'
import DateFormat from '@/utils/day'
import { useState, useEffect, useContext } from 'react'
import trans from '@/hooks/fetch'
import { toast } from "@/utils/toaster/toast"
import { createChat } from "@/utils/MessageServices/CreateChat"
import { getDb } from '@/storage/db'
import { v4 as uuidv4 } from 'uuid'
import AppEvent, { Events } from '@/utils/eventEmitter'

interface RequestProps {
  item?: any,
  isLast?: boolean,
  onSubmit?: () => void
}

const RequestView = ({item, isLast, onSubmit}: RequestProps) => {
  const { handleViber } = haptics()
  const [loading, setLoading] = useState(false)
  
  const submit = (id) => AppEvent.emit(Events.REQUEST_SUBMISSION, id)
  console.log(item);
  
  const accept_req = async () => {
    try {
      if (!item) return
      const db = await getDb()
      await db?.runAsync(`
        UPDATE chats
        SET status = ?
        WHERE id = ?
      `, ['accepted', item.chat_id])
      
      /*const accept = await trans('/api/chat/createConversation', {
        body: { 
          sender: item.sender_id,
          receiver: item.receiver_id,
          req_id : item.id 
        }
      })
      if (accept.code == 904) {
        toast('Request accepted ✓')
        onSubmit(item.id)
      }*/
      console.log('Request accepted successfully 🤌🏻');
    } catch (err) {
      toast('Something went wrong, try again.')
      console.error(err);
    }finally{
      submit(item)
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
        }} src={item.avatar}/>
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
            fontSize: 17,
          }}>{item.name}</Text>
          <Text style={{
            color: 'darkgray',
            fontSize: 13,
          }}>{DateFormat(item.created_at * 1000)}</Text>
        </View>
        <Text numberOfLines={1} style={{
          color: 'white',
          marginTop: 2,
        }}>{item.name}: {item.content}</Text>
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