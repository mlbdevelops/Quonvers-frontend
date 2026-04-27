import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useState, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { TickDouble02Icon } from '@hugeicons/core-free-icons';
import { CheckCheck, Check } from 'lucide-react-native'
import { shouldShowAvatar } from '../../utils/logics/is_same_sender.ts'
//import dateFormat from '../../utils/day.ts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const Message = ({item, logged_user, onLongPress, shouldShow, isMyLastMessage, isLast}) => {
  const [showTimestamp, setShowTimestamp] = useState(false)
  const [reaction, setReaction] = useState([])
  
  function hasAnyAlphabet() {
    return /\p{L}/u.test(item.content)
  }
  
  return (
    <Pressable 
      onLongPress={onLongPress} 
      style={{
        ...item.sender_id == logged_user? styles.msgRight : styles.msgLeft, 
        marginBottom: isLast? 10 : shouldShow? 10 : 0,
        backgroundColor: !hasAnyAlphabet()? (hasAnyAlphabet() && item?.content?.split("").length >= 2? 'transparent' : '#202020c6') : undefined,
        borderRadius: !hasAnyAlphabet()? 25 : undefined,
      }}
    >
      {item.sender_id !== logged_user && <View style={{
        height: 26.5,
        width: 26.5,
        backgroundColor: '#1d1d1d',
        borderRadius: 50,
        transform: shouldShow? 'scale(1)' : 'scale(0)'
      }}></View>}
      
      <View style={{
        ...item.sender_id === logged_user? styles.msgRight.msgTextRight : styles.msgLeft.msgTextLeft,
        ...!hasAnyAlphabet() && styles.condStyle
      }}>
        <Text style={{
          color: 'white',
          fontSize: hasAnyAlphabet()? 14 : (50 - (item.content.length * 4)),
          padding: hasAnyAlphabet()? 0 : undefined,
          borderWidth: 0,
          borderColor: 'white',
        }}>{item.content}</Text>
      </View>
      <Text style={{
        color: '#707070',
        display: item.sender_id === logged_user && isMyLastMessage? undefined : 'none',
        marginRight: 5,
        fontWeight: 'normal',
        fontSize: 13,
        marginTop: 1,
      }}>Sending</Text>
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
    fontSize: 14.5,
    wordBreak: 'break-word',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
   
    msgTextLeft: {
      backgroundColor: '#262626',
      borderRadius: 20,
      //borderBottomLeftRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 12,
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
    fontSize: 14.5,
   
    msgTextRight : {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#6a69fe',
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
    //margin: 3,
  }
});

export default Message;