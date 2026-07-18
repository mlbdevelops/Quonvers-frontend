import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageReply = ({isMyMessage, isReplyMsgMine, bubble_color, reply_data}) => {
  return (
    <View style={{
      backgroundColor: 'transparent',
      marginBottom: 10,
    }}>
      <View></View>
      <Text numberOfLines={1} style={{
        color: 'darkgrey',
        marginVertical: 5,
        fontSize: 12,
        display: reply_data.content? undefined : 'none',
        alignSelf: isMyMessage? 'flex-end' : 'flex-start',
      }}>{reply_data.reply_sender_name} replied {reply_data?.reply_receiver_name && 'to '}{reply_data?.reply_receiver_name}</Text>
      <View style={{
        flexDirection: 'row',
        gap: 8
      }}>
        <View style={{
          height: '100%',
          width: 2.5,
          display: isMyMessage? 'none' : undefined,
          borderRadius: 50,
          backgroundColor: '#707070',
        }}/>
        <View style={{
          ...isReplyMsgMine? styles.msgTextRight : styles.msgTextLeft,
          opacity: .6,
          backgroundColor: isReplyMsgMine? bubble_color : '#222222'
        }}>
          <Text numberOfLines={10} style={{
            color: 'white',
            fontStyle: reply_data.content? 'normal' : 'italic',
          }}>{reply_data.content || 'Message unavailable'}</Text>
        </View>
        <View style={{
          height: '100%',
          display: !isMyMessage? 'none' : undefined,
          width: 2.5,
          borderRadius: 50,
          backgroundColor: '#707070',
        }}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgTextLeft: {
    backgroundColor: '#1d1d1d',
    borderRadius: 20,
    //borderBottomLeftRadius: 5,
    paddingVertical: 9,
    paddingHorizontal: 14,
    whiteSpace: 'pre-line',
  },
  
  msgTextRight : {
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: 'red',
    //borderBottomRightRadius: 5,
    borderRadius: 20,
    textAlign: 'start',
    whiteSpace: 'pre-line',
  }
});

export default MessageReply;