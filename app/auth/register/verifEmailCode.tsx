import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect } from 'react'
import { Stack, router, useSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import Button from '../../../components/reusables/button.tsx'
import { toast } from "../../../utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import trans from '../../../hooks/fetch.ts'
import userContext from '../../../hooks/useUser.tsx'

const checkCode = () => {
  const authContext = useContext(AuthContext)
  const [code, setCode] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [stopLoad, setStopLoad] = useState(false)
  const email = authContext.temp_user_data.email
  
  const send_code = async () => {
    try {
      if (!email) {
        return
      }
      setisLoading(true)
      const res = await trans('/api/verification/check/email', {
        body: { email, code },
        headers: {'Content-Type': 'application/json'}
      })
      
      if (res.success) {
        setisLoading(false)
        if (!email) {
          return
        }
        router.replace('/auth/register/name')
      }else{
        toast('Wrong code!')
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
      }}>Verify your email</Text>
      
      <Text style={{
        fontSize: 13,
        marginTop: 10,
        color: 'white',
      }}>Enter the code sent to your email. The code expires in 10 minutes</Text>
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 5,
        marginTop: 20,
      }}>
        <Text style={{
          color: '#6a69fe',
          alignSelf: 'flex-start',
          fontWeight: 'bold'
        }}>Code</Text>
        <TextInput 
          placeholderTextColor='darkgray' 
          placeholder='eg. 123456'
          maxLength={6}
          value={code}
          keyboardType='numeric'
          onChangeText={(value) => setCode(value)}
          style={{
            width: '100%',
            height: 45,
            borderRadius: 50,
            backgroundColor: '#1d1d1d',
            paddingHorizontal: 15,
            color: 'white',
            marginBottom: 5,
          }}
        />
        <Button onPress={send_code} title='Submit' loading={isLoading} loading_msg='Submitting'/> 
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