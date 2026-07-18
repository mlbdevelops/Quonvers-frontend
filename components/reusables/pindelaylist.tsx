import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import RadioList from '@/components/reusables/radioList'
import Button from '@/components/reusables/button'
import { getDb } from '@/storage/db'
import { socket } from '@/hooks/sockets/socket_provider';
import { useCustomAlert } from '@/hooks/alert'
import { pin_message } from '@/utils/MessageServices/pin'

const PinDelayList = ({msg, onPick, onClose, logged_user, toUser}) => {
  const [delay, setDelay] = useState(null)
  const [delayIndex, setDelayIndex] = useState(1)
  const alert = useCustomAlert()
  
  const options = [
    '7 Hours',
    '24 Hours',
    '3 Days',
    '14 Days',
    '30 Days',
  ]
  
  const optionsMillis = [
    25200000,
    86400000,
    259200000,
    1209600000,
    2592000000,
  ];
  
  const handleSave = async () => {
    if(!socket.connected) {
      alert(null, 'Unable to pin message, connect to the internet and try again.', [{ text: 'Ok', primary: true }])
      return onClose()
    }
    const pinObj = {
      message_id: msg?.id,
      unpin_at: Date.now() + optionsMillis[delayIndex - 1],
      pinned_at: Date.now(),
      chat_id: msg?.chat_id
    }
    if(!logged_user || !toUser) return
    try {
      const db = await getDb()
      await pin_message(msg?.id, pinObj.unpin_at, pinObj.chat_id)
    } catch (error) {
      console.error(error);
    }finally{
      socket.emit('command:send', {
        type: 'pin_message',
        toUser,
        sender_id: logged_user,
        chat_id: null,
        room_type: 'private',
        value: pinObj
      })
      onPick({pinObj, durationText: options[delayIndex - 1]})
    }
  }
  
  return (
    <Modal onRequestClose={onClose} transparent animationType='fade'>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}>
        <View style={{
          backgroundColor: '#171717',
          borderRadius: 30,
          padding: 27,
          paddingVertical: 18,
          gap: 5,
          width: 290,
        }}>
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 25,
          }}>Duration</Text>
          <Text style={{
            color: 'white',
            //fontWeight: 'bold',
            //fontSize: 25,
            marginBottom: 7,
          }}>Choose how long this message stays pinned. You can unpin at anytime</Text>
          <RadioList 
            defaultIndex={delayIndex}
            onIndexChange={(e) => {
              setDelayIndex(e.index)
            }}
            options={options}
            style={{
              backgroundColor: null,
              padding: null,
              //width: 200
            }}
            itemStyle={{
              padding: null,
              paddingVertical: 7,
            }}
          />
          <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10
          }}>
            <Button style={{
              width: null,
              height: null,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }} flat onPress={onClose} title={'Cancel'}/>
            <Button onPress={handleSave} style={{
              paddingHorizontal: 15,
              paddingVertical: 8,
              width: null,
              height: null,
            }} title={'Save'}/>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PinDelayList;