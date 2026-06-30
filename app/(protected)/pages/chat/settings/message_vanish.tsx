//import RadioList from '../../../../../components/reusables/radioList';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/header'
import RadioList from '@/components/reusables/radioList'
import Button from '@/components/reusables/button'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import { getDb } from '@/storage/db'
import { router, useLocalSearchParams } from 'expo-router'
import AppEvent, { Events } from '@/utils/eventEmitter'
import { socket } from '@/hooks/sockets/socket_provider';
import { storage } from '@/storage/mmkv'
import Switch from '@/components/reusables/switch'

const MessageVanish = () => {
  const [savedSettings, setSavedSettings] = useState<boolean>()
  const [initialIndex, setInitialIndex] = useState<number | null>(null)
  const [newIndex, setNewIndex] = useState(null)
  const [selectionText, setSelectionText] = useState('')
  const { chat_id, id: user_id } = useLocalSearchParams()
  const [logged_user, setLoggedUser] = useState<string | null>(JSON.parse(storage.getString('user')).user.id)
  
  const options = [
    'Off',
    '7 Hours',
    '14 Hours',
    '24 Hours',
    '3 Days',
    '14 Days',
    '30 Days',
    '90 Days'
  ]
  
  const optionsMillis = [
    0,
    25200000,
    50400000,
    86400000,
    259200000,
    1209600000,
    2592000000,
    7776000000
  ];

  
  useEffect(() => {
    (async () => {
      const db = await getDb()
      const getSettings = await db.getFirstAsync('SELECT * FROM disappear_setting WHERE chat_id = ?', [chat_id])
      setSavedSettings(getSettings ? true : false)
      setInitialIndex(getSettings?.ui_index ?? 1)
      setNewIndex(getSettings?.ui_index ?? 1)
    })()
  }, [])
  
  const saveEdit = async () => {
    if(newIndex === initialIndex) return
    if(!newIndex) return
    const db = await getDb()
    //return await db.runAsync('DELETE FROM disappear_setting')
    try {
      if(!savedSettings){
        await db.runAsync(`
          INSERT INTO disappear_setting(
            chat_id,
            disappearing_millisecs,
            ui_index,
            set_by
          )
          VALUES(?, ?, ?, ?)
        `, [
          chat_id,
          options[newIndex - 1],
          newIndex,
          user_id
        ])
      }else{
        await db.runAsync(`
          UPDATE disappear_setting
          SET disappearing_millisecs = ?, ui_index = ?, set_by = ?
          WHERE chat_id = ?
        `, [
          optionsMillis[newIndex - 1],
          newIndex,
          user_id,
          chat_id
        ])
      }
    } catch (error) {
      toast('An error occured, please try again')
    }finally{
      setInitialIndex(newIndex)
      AppEvent.emit(Events.MSG_VANISH, {chat_id, duration: optionsMillis[newIndex - 1], selectionText})
      socket.emit('command:send', {
        type: 'message_vanish',
        toUser: user_id,
        sender_id: logged_user,
        chat_id,
        room_type: 'private',
        value: {
          duration: optionsMillis[newIndex - 1],
          ui_index: newIndex
        }
      })
      toast('Time set to ' + selectionText + ' ✓')
    }
  }
  
  return (
    <View style={styles.container}>
      <Header isBack styleType={'chat_settings'} title={'Disapearing messages'}/>
      <Toaster position={'center'}/>
      <View style={{
        width: '100%',
        alignItems: 'center',
        gap: 10
      }}>
        <RadioList 
          defaultIndex={newIndex || initialIndex}
          ui_notifier_index={initialIndex}
          onIndexChange={(e) => {
            setNewIndex(e.index)
            setSelectionText(e.title)
          }}
          options={options}
          style={{
            marginTop: 10,
            paddingVertical: 15,
            borderRadius: 20,
          }}
        />
        <Text style={{
          color: 'darkgrey',
          //textAlign: 'center',
          maxWidth: '92%',
        }}>When enabled, every new messages from this chat for everyone will disappear after they have been seen.</Text>
      </View>
      <View style={{
        width: '92%',
      }}>
        <Button title={'Save'} titleStyle={{
          fontWeight: 'bold',
        }} onPress={saveEdit} style={{
          marginTop: 10,
          marginBottom: 15,
          opacity: newIndex === initialIndex? .5 : 1,
        }}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default MessageVanish;