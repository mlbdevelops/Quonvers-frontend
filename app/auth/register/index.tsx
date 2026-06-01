import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard, Pressable } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import Button from '../../../components/reusables/button.tsx'
import { toast } from "../../../utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import trans from '../../../hooks/fetch.ts'
import { useCustomAlert } from '@/hooks/alert'
import { useKeyboard } from '@/hooks/keyboard'

const register = () => {
  const authContext = useContext(AuthContext)
  const sprms = useLocalSearchParams()
  const [email, setEmail] = useState(sprms.email)
  const [isLoading, setisLoading] = useState(false)
  const [stopLoad, setStopLoad] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const alert = useCustomAlert()
  const { isKeyboardOpen } = useKeyboard()
  const send_code = async () => {
    try {
      if (!email) {
        return
      }
      setisLoading(true)
      const res = await trans('/api/verification/send/email', {
        body: { email },
        headers: {'Content-Type': 'application/json'}
      })
      
      if(res.code == 904){
        alert(null, 'The email entered is already used, try to login instead.', [
          {
            text: 'Try again',
            onPress: () => setIsFocused(true),
          },
          {
            text: 'Login',
            onPress: () => router.replace({ pathname:'/auth', params: { email }}),
            primary: true
          },
        ])
      }
      
      if (res.status == 201) {
        setisLoading(false)
        if (!email) {
          return
        }
        authContext.insertIntoTemp(email, 'email')
        setTimeout(() => {
          router.push({
            pathname: '/auth/register/verifEmailCode',
            params: {
              email
            }
          })
        }, 0);
      }
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      toast('Network error')
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
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
        <TouchableOpacity onPress={() => isLoading? toast("Wait while loading...") : router.back()}>
          <ArrowLeft color='white'/>
        </TouchableOpacity>
        <Pressable style={{
          opacity: isLoading? .5 : 1,
        }} onPress={() => !isLoading && router.replace({ pathname:'/auth', params: { email }})}>
          <Text style={{
            color: '#6a69fe',
            fontWeight: 'bold',
            fontSize: 16,
          }}>Login</Text>
        </Pressable>
      </View>
      <Text style={{
        fontSize: 27,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#6a69fe',
      }}>Sign up</Text>
      
      <Text style={{
        fontSize: 13,
        marginTop: 10,
        color: 'white',
      }}>We'll send a 6 digits code to your email in order to verify your identity.</Text>
      
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
          //marginHorizontal: 10,
        }}>Email</Text>
        <TextInput 
          placeholderTextColor='darkgray' 
          placeholder='eg. example@gmail.com'
          value={email}
          autoFocus
          keyboardType='email-adress'
          cursorColor='#6a69fe'
          selectionColor="#6a69fe"
          autoCapitalize={'none'}
          onChangeText={(value) => setEmail(value.toLowerCase().trim())}
          style={{
            width: '100%',
            height: 45,
            borderRadius: 14,
            backgroundColor: '#1d1d1d',
            paddingHorizontal: 15,
            color: 'white',
            marginBottom: 5,
          }}
        />
        <Button 
          style={{
            opacity: email && !isLoading? 1 : email && isLoading? .5 : .5,
          }}
          onPress={async () => {
            if(!email){
              return
            }
            isKeyboardOpen && await Keyboard.dismiss()
            setIsFocused(false)
            setTimeout(() => {
              alert(null, <>Are you sure that <Text style={{ color: '#6a69fe',}}>{email}</Text> is your real email and still available?</>, 
              [
                {
                  text: 'Check'
                },
                {
                  text: 'Yes',
                  primary: true,
                  onPress: () => send_code()
                }
              ])
            }, isKeyboardOpen? 300 : 0)
          }} 
          title='Send code' 
          loading={isLoading} 
          loading_msg='Sending...'
        /> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    gap: 4,
  },
});

export default register;