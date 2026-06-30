import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '@/components/header'
import { useLocalSearchParams } from 'expo-router'
import Switch from '@/components/reusables/switch'
import { getDb } from '@/storage/db'
import { useCustomAlert } from '@/hooks/alert'
import AppEvent, { Events } from '@/utils/eventEmitter'

const Mute = () => {
  const { chat_id, name, avatar } = useLocalSearchParams()
  const [isMuted, setIsMuted] = useState(null)
  const [isReady, setisReady] = useState(false)
  const alert = useCustomAlert()
  
  useEffect(() => {
    ( async () => {
      try {
        const db = await getDb()
        const getStatus = await db.getFirstAsync('SELECT muted FROM chats WHERE id = ?', [chat_id])
        setIsMuted(getStatus.muted)
      } catch (error) {
        console.error(error);
      }finally{
        setisReady(true)
      }
    })()
  }, [])
  
  const ask = (value) => {
    if(isReady && isMuted) return mute(value)
    alert('Mute notifications', 'Are you sure you want to mute notifications for this chat', [{text: 'Cancel'}, {text: 'Mute', primary: true, onPress: () => mute(value)}])
  }
  
  const mute = async (value) => {
    if(!isReady) return
    try {
      const db = await getDb()
      await db.runAsync('UPDATE chats SET muted = ? WHERE id = ?', [value, chat_id])
    } catch (error) {
      console.error(error);
    }finally{
      setIsMuted(value)
      AppEvent.emit(Events.MUTE_CHAT, {value, chat_id})
    }
  }
  
  return (
    <View style={styles.container}>
      <Header title={`Mute notifications`} isBack styleType='chat_settings'/>
      <TouchableOpacity onPress={() => isReady && ask(!isMuted)} style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '92%',
        backgroundColor: '#171717',
        padding: 15,
        borderRadius: 20,
      }}>
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
        }}>Mute notifications</Text>
        <Switch enabled={isReady} oneWayChange defaultValue={isMuted} onChange={ask} />
      </TouchableOpacity>
      <Text style={{
        color: 'darkgrey',
        paddingVertical: 10,
        maxWidth: '92%',
      }}>When enabled, you will not receive notifications from this chat. Other members will not be notified that you muted this chat.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Mute;