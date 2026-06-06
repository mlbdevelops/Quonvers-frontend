import Image from './Image';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useState, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { TickDouble02Icon } from '@hugeicons/core-free-icons';
import { CheckCheck, Check } from 'lucide-react-native'
import { shouldShowAvatar } from '../../utils/logics/is_same_sender.ts'
import AppEvent, { Events } from '@/utils/eventEmitter'
import DateFormat from '@/utils/day'

const Message = ({item, logged_user, onLongPress, shouldShow, isMyLastMessage, isLast, room_icon}) => {
  const [showTimestamp, setShowTimestamp] = useState(false)
  const [msgStatus, setMsgStatus] = useState(item.status)
  const [msgStatusAt, setMsgStatusAt] = useState(item.status_at * 1000)
  const [reaction, setReaction] = useState([])
  
  function hasAnyAlphabet() {
    return /\p{L}/u.test(item.content)
  }
  
  useEffect(() => {
    AppEvent.on(Events.MSG_STATUS_UPDATE, (e) => {
      if (e.msg_id === item.id) {
        setMsgStatus(e.status)
        setMsgStatusAt(e.at)
      }
    })
  }, [])
  
  
  return (
    <Pressable 
      onLongPress={onLongPress} 
      style={{
        ...item.sender_id == logged_user? styles.msgRight : styles.msgLeft, 
        marginBottom: isLast? 10 : shouldShow? 10 : 0,
        //backgroundColor: !hasAnyAlphabet()? (hasAnyAlphabet() && item?.content?.split("").length >= 2? 'transparent' : '#202020c6') : undefined,
        //borderRadius: !hasAnyAlphabet()? 25 : undefined,
      }}
    >
      {item.sender_id !== logged_user && <Image src={room_icon} style={{
        height: 26.5,
        width: 26.5,
        backgroundColor: '#1d1d1d',
        borderRadius: 50,
        transform: shouldShow? 'scale(1)' : 'scale(0)'
      }}/>}
      <View style={{
        ...item.sender_id === logged_user? styles.msgRight.msgTextRight : styles.msgLeft.msgTextLeft,
      }}>
        <Text style={{
          color: 'white',
          //fontSize: hasAnyAlphabet()? 14.5 : (50 - (item.content.length * 4)),
          padding: hasAnyAlphabet()? 0 : undefined,
          borderWidth: 0,
          borderColor: 'white',
          fontSize: 15,
        }}>{item.content}</Text>
      </View>
      <Text style={{
        color: '#707070',
        display: item.sender_id === logged_user && isMyLastMessage? undefined : 'none',
        marginRight: 5,
        fontWeight: '460',
        fontSize: 13,
        marginTop: 1,
      }}>{msgStatus} {msgStatus !== 'Sending' && DateFormat(msgStatusAt)}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  condStyle: {
    backgroundColor: 'transparent'
  },
  
  msgLeft: {
    minWidth: 50,
    alignSelf: 'flex-start',
    maxWidth: 250,
    textAlign: 'start',
    marginHorizontal: 8,
    marginVertical: 5,
    wordBreak: 'break-word',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
   
    msgTextLeft: {
      backgroundColor: '#262626',
      borderRadius: 20,
      //borderBottomLeftRadius: 5,
      paddingVertical: 9,
      paddingHorizontal: 14,
      whiteSpace: 'pre-line',
    }
  },

  msgRight : {
    minWidth: 50,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: 250,
    marginHorizontal: 10,
    marginVertical: 5,
    marginBottom: 8,
    wordBreak: 'line-break',
    
    msgTextRight : {
      paddingVertical: 9,
      paddingHorizontal: 14,
      backgroundColor: '#5E4BFA' || '#6a69fe',
      //borderBottomRightRadius: 5,
      borderRadius: 20,
      textAlign: 'start',
      whiteSpace: 'pre-line',
    }
  },
  
  timestamp :{
    fontSize: 10,
    color: '#cecece',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    fontWeight: 'bold',
    //margin: 3,
  }
});

export default Message;