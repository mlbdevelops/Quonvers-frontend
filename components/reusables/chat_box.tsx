import Image from './Image';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'

export default function ChatBox({chat}) {
  const [has_unread, setHas_unread] = useState(chat?.unread_count > 0)
  return(
    <TouchableHighlight
      underlayColor='#1d1d1d6c'
      onPress={() => {
        setHas_unread(false)
        router.push({
          pathname: '/pages/chat',
          params: {
            chat_id: chat?.id,
            chat_type: chat?.type,
            avatar: chat.chat_avatar,
            name: chat.recipient_name
          }
        })}
      }
    >
      <View style={styles.box}>
        <Image
          src={chat.chat_avatar}
          style={{
            width: 50,
            height: 50,
          }}
        />
        
        <View className='flex-1 flex flex-col' style={styles.name_msg}>
          <Text className='text-white' 
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {chat.recipient_name}
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
            {chat?.last_message_preview? chat?.last_message_preview : 'Send a message'}
          </Text>
        </View>
        <View style={styles.controls}>
          <Text style={{
            fontWeight: !has_unread? 'normal' : 'bold',
            color: !has_unread? 'darkgray' : 'white',
            fontSize: 12,
            marginBottom: 4,
          }}>4:18PM</Text>
          <View style={{
            ...styles.badge,
            opacity: has_unread? 1 : 0,
            width: chat?.unread_count >= 9? 28 : 20,
          }}><Text style={{
            color: 'white',
          }}>{chat?.unread_count}</Text></View>
        </View>
      </View>
    </TouchableHighlight>
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