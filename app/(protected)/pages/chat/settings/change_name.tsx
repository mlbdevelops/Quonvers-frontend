import Image from '../../../../../components/reusables/Image';
import Button from '../../../../../components/reusables/button';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard } from 'react-native';
import Header from '@/components/header'
import { useLocalSearchParams } from 'expo-router'
import { getDb } from '@/storage/db'
import KeyboardAvareView from '@/components/reusables/keyboardAvareView'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import AppEvent, { Events } from '@/utils/eventEmitter'

const ChangeName = () => {
  const { id, avatar, name, chat_id } = useLocalSearchParams()
  const [initialName, setinitialName] = useState(name)
  const [originalName, setOriginalName] = useState(null)
  const [newName, setNewName] = useState(name)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  
  React.useEffect(() => {
    (async() => {
      const db = await getDb()
      const getName = await db.getFirstAsync('SELECT name FROM users WHERE user_id = ?', [id])
      setOriginalName(getName.name)
    })()
  }, [])
  
  const editNameFunc = async () => {
    const db = await getDb()
    if(!newName) return
    if(newName === initialName) return
    try {
      await db.runAsync(`
        UPDATE chat_members
        SET nickname = ?
        WHERE user_id = ? AND chat_id = ?
      `, [newName, id, chat_id])
      setinitialName(newName)
      AppEvent.emit(Events.NICKNAME_CHANGE, {newName, chat_id})
      Keyboard.dismiss()
      setTimeout(() => toast('Changed'), 500)
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <View style={styles.container}>
      <Toaster position={'center'}/>
      <Header title={'Change name'} isBack titleStyle={{
        fontSize: 18,
        fontWeight: 'normal',
      }}
        headerRightContents={
          <Button onPress={() => {
            setNewName(originalName)
            setTimeout(() => editNameFunc(), 10)
          }} style={{
            width: null,
            paddingHorizontal: 10,
            backgroundColor: null,
            color:'#6a69fe',
            opacity: initialName !== originalName? 1 : .5
          }} title={'Reset'}/>
        }
      />
        <View style={{
          alignItems: 'center',
          marginTop: 20,
          flex: 1,
        }}>
          <Image size={90} src={avatar}/>
          <TextInput autoFocus placeholder={'Write here...'} value={newName} placeholderTextColor='darkgray' onChangeText={(e) => {
              setNewName(e)
              if(e.length >= 23) setError(true)
              else if(!e.length) setError(true)
              else setError(false)
            }} style={{color:'white', fontWeight: 'bold', fontSize: 25, alignItems: 'center', paddingHorizontal: 20,}} cursorColor='#6a69fe' selectionColor="#6a69fe"/>
          <Text style={{
            color: 'tomato',
            display: !error && 'none',
          }}>{!newName.length? 'Invalid' : 'Too long'}</Text>
        </View>
        <Text style={{color: 'darkgray',}}>Only you can see the edited name</Text>
        <Button onPress={!error && editNameFunc} style={{
          width: '92%',
          marginVertical: 15,
          opacity: error? .5 : (newName.trim() == name.trim()? .5 : newName.trim() != initialName.trim()? 1 : .5)
        }} title={'Change'}/>
        <KeyboardAvareView/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ChangeName;