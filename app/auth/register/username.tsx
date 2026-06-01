import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect } from 'react'
import { Stack, router, useSearchParams } from 'expo-router'
import { ArrowLeft, Check, X } from 'lucide-react-native'
import Button from '../../../components/reusables/button.tsx'
import { toast } from "../../../utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import trans from '../../../hooks/fetch.ts'
import userContext from '../../../hooks/useUser.tsx'

const checkCode = () => {
  const authContext = useContext(AuthContext)
  const [username, setUsername] = useState(authContext.tempUserData.username || '')
  const [available, setAvailable] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  
  const insert_username = async () => {
    if(checking){
      return
    }
    
    if (!username || available == 'not ok') {
      return
    }
    const insert = authContext.insertIntoTemp(username, 'username')
    if (insert.ok) {
      router.push('/auth/register/age')
    }
  }
  
  const chech_availability = async (username) => {
    setChecking(true)
    const res = await trans('/api/auth/check_username',  {
      body: { username },
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    
    if (res.code == 804) {
      setAvailable('not ok')
    }
    if (res.code == 805) {
      setAvailable('ok')
    }
    setChecking(false)
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerShown: false,
      }}/>
      <Toaster/>
      <View style={{
        width: '100%',
        paddingVertical: 20,
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color='white'/>
        </TouchableOpacity>
      </View>
      
      <Text style={{
        fontSize: 27,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#6a69fe',
      }}>Set a username</Text>
      
      <Text style={{
        fontSize: 13,
        marginTop: 10,
        color: 'white',
      }}>Set a unique username to your new account.</Text>
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 5,
        marginTop: 20,
      }}>
        <Text style={{
          color: 'white',
          alignSelf: 'flex-start',
          fontWeight: 'bold'
        }}>Username</Text>
        <TextInput 
          placeholderTextColor='darkgray' 
          placeholder='eg. alex.olsen'
          value={username}
          autoFocus
          autoCapitalize={'none'}
          cursorColor='#6a69fe'
          selectionColor="#6a69fe"
          onChangeText={(value) => {
            setUsername(value.toLowerCase().trim())
            chech_availability(value.toLowerCase().trim())
          }}
          style={{
            width: '100%',
            height: 45,
            borderRadius: 15,
            backgroundColor: '#1d1d1d',
            paddingHorizontal: 15,
            color: 'white',
            marginBottom: 5,
            borderWidth: (available == 'ok' && username) || (available == 'not ok' && username) ? 1 : 0,
            borderColor: (available == 'ok' && username) ? '#32ff32' : (available == 'not ok' && username)? 'tomato' : 'tranparent',
          }}
        />
        {available && username &&
          (
            <View style={{
              flexDirection: 'row',
              gap: 7,
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: 5,
            }}>
              { available == 'not ok'? <View style={{
                borderWidth: 1,
                borderColor: 'tomato',
                padding: 2,
                borderRadius: 50,
              }}><X size={10} color='tomato'/></View>: <View style={{
                borderWidth: 1,
                padding: 2,
                borderColor: '#32ff32',
                borderRadius: 50,
              }}><Check size={10} color='#32ff32'/></View> }
              <Text style={{
                color: available == 'not ok'? 'tomato' : '#32ff32',
                alignSelf: 'flex-start',
              }}>{available == 'not ok'? 'Username unavailable' : 'Available'}</Text>
            </View>
          )
        }
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Button onPress={() => router.back()} title='Previous' loading={false} style={{
            width: '48.5%',
            backgroundColor: '#262626',
          }}/> 
          <Button onPress={insert_username} title={'Next'} loading={checking} style={{
              width: '48.5%',
              opacity: checking? .5 : available == 'not ok' || !username? .5 : 1,
            }}/> 
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    gap: 4
  },
});

export default checkCode;