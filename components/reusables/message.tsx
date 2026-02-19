import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useState, useEffect } from 'react'

const Message = ({item, logged_user, onLongPress}) => {
  const [showTimestamp, setShowTimestamp] = useState(false)
  const [reaction, setReaction] = useState([])
  
  return (
    <Pressable onLongPress={onLongPress} style={item.sender_id == logged_user? styles.msgRight : styles.msgLeft}>
      {item.sender_id !== logged_user && <View style={{
        height: 26.5,
        width: 26.5,
        backgroundColor: '#1d1d1d',
        borderRadius: 50,
      }}></View>}
      <View style={{
        alignItems: item.sender_id == logged_user? 'flex-end' : 'flex-start',
      }}>
        <View style={{
          color: 'white',
          position: 'relative',
          ...item.sender_id === logged_user? styles.msgRight.msgTextRight : styles.msgLeft.msgTextLeft
        }}>
          <Text style={{color: 'white'}}>{item.content}</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          gap: 5,
          alignItems: 'center',
          margin: 3,
        }}>
          
          <View styles={{
            flexDirection: 'row',
            gap: 3
          }}>
            {reaction.map((item, i) => (
              <Text key={i} style={{
                fontSize: 10,
              }}>{item}</Text>
            ))}
          </View>
          <Text style={
            styles.timestamp
          }>{item.timestamp}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  msgLeft: {
    minWidth: 50,
    alignSelf: 'flex-start',
    maxWidth: 250,
    textAlign: 'start',
    marginHorizontal: 8,
    marginVertical: 8,
    fontSize: 14.5,
    wordBreak: 'break-word',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
   
    msgTextLeft: {
      backgroundColor: '#2c1e55',
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
    marginVertical: 8,
    wordBreak: 'line-break',
    fontSize: 14.5,
   
    msgTextRight : {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#6a69fe',
      borderRadius: 20,
      //borderBottomRightRadius: 5,
      textAlign: 'start',
      whiteSpace: 'pre-line',
    }
  },
  
  timestamp :{
    fontSize: 10,
    color: 'darkgray',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    //margin: 3,
  }
});

export default Message;