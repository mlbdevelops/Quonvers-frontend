import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect } from 'react'
import { Stack, router, useSearchParams } from 'expo-router'
import { ArrowLeft, Info } from 'lucide-react-native'
import Button from '../../../components/reusables/button.tsx'
import { toast } from "../../../utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import trans from '../../../hooks/fetch.ts'
import userContext from '../../../hooks/useUser.tsx'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '@/storage/mmkv'

const checkCode = () => {
  const authContext = useContext(AuthContext)
  const [password2, setPassword2] = useState('')
  const [password1, setPassword1] = useState('')
  const [available, setAvailable] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [misMatchErrorMsg, setMisMatchErrorMsg] = useState(false)
  const [lengthErrorMsg, setLengthErrorMsg] = useState(false)
  
  const insert_username = async () => {
    
    if (password1 !== password2) {
      setLengthErrorMsg(false)
      return setMisMatchErrorMsg(true)
    }
    
    const password = password2
    
    if (password.length <= 6) {
      setMisMatchErrorMsg(false)
      return setLengthErrorMsg(true)
    }
    
    if (!authContext.tempUserData.email) {
      return
    }
    
    try {
      const insert = { 
        ...authContext.tempUserData,
        password
      }
      const save = await trans('/api/auth/register', {
        body: insert,
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      if (save.code == 201) {
        await storage.set('token', save.token)
        authContext.logIn(save.user)
      }
    } catch (error) {
      console.log(error);
      toast('Something bad happened, check your network connection and try again.')
    }
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
      }}>Password</Text>
      
      <Text style={{
        fontSize: 13,
        marginTop: 10,
        color: 'white',
      }}>Set a password to secure your account.</Text>
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
          fontWeight: 'bold',
          opacity: 0,
          display: 'none',
        }}>New password</Text>
        <TextInput 
          placeholderTextColor='darkgray' 
          placeholder='New password'
          value={password1}
          secureTextEntry
          cursorColor='#6a69fe'
          selectionColor="#6a69fe"
          autoFocus
          onChangeText={(value) => {
            setPassword1(value)
          }}
          style={{
            width: '100%',
            height: 45,
            borderRadius: 15,
            backgroundColor: '#1d1d1d',
            paddingHorizontal: 15,
            color: 'white',
            marginBottom: 5,
          }}
        />
        
        <Text style={{
          color: 'white',
          alignSelf: 'flex-start',
          fontWeight: 'bold',
          marginTop: 0,
          display: 'none',
        }}>Re-enter password</Text>
        
        <TextInput 
          placeholderTextColor='darkgray' 
          placeholder='Re-enter Password'
          value={password2}
          secureTextEntry
          cursorColor='#6a69fe'
          selectionColor="#6a69fe"
          onChangeText={(value) => {
            setPassword2(value)
          }}
          style={{
            width: '100%',
            height: 45,
            borderRadius: 15,
            backgroundColor: '#1d1d1d',
            paddingHorizontal: 15,
            color: 'white',
            marginBottom: 5,
            marginTop: 10,
          }}
        />
        
        <View style={{
          alignSelf: 'flex-start',
          marginBottom: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}><Info size={15} color={misMatchErrorMsg? 'tomato' : lengthErrorMsg? '#ffd200' : 'darkgray'}/><Text style={{
            color: misMatchErrorMsg? 'tomato' : lengthErrorMsg? '#ffd200' : 'darkgray',
          }}
        >{misMatchErrorMsg? 'Password do not match' : lengthErrorMsg? 'Your password is too short' : 'Must be at least 6 characters'}</Text></View>
        
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Button onPress={() => router.back()} title='Previous' loading={false} style={{
            width: '48.5%',
            backgroundColor: '#262626',
          }}/> 
          <Button onPress={insert_username} title='Next' loading={isLoading} loading_msg='Submitting' style={{
              width: '48.5%',
              opacity: !password2 || !password1? .5 : 1,
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