import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import Button from '../../../components/reusables/button.tsx'
import { toast } from "../../../utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import trans from '../../../hooks/fetch.ts'

const register = () => {
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [stopLoad, setStopLoad] = useState(false)
  
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
      
      if (res.status == 201) {
        setisLoading(false)
        toast(res.msg)
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
        }, 1000);
      }else{
        toast(`${res.msg} Code: ${res.status}`)
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
      toast('Somthing went wrong, check your internet connection and try again.')
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
      }}>Add a profile picture</Text>
      
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 5,
        marginTop: 20,
      }}>
        <View>
          
        </View>
        <Button onPress={send_code} title='Send the code' loading={isLoading} loading_msg='Sending code'/>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default register;