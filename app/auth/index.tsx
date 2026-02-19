import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Button from '@/components/reusables/button.tsx'
import trans from '@/hooks/fetch.ts'

const Login = () => {
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const login = async () => {
    try {
      
      if (!email && !password) {
        return;
      }
      setIsLoading(true);
      const res = await trans('/api/auth/login', {
        headers: {
          'Content-Type' : 'application/json'
        },
        body: {email, password}
      })
      
      if (res.code == 803) {
        toast(res.msg)
        setIsLoading(false)
        return;
      };
      if (res.code == 807) {
        toast(res.msg)
        setIsLoading(false)
        return;
      }
      
        console.log('🔥🔥🔥🔥🔥🔥🔥', res.token);
      if (res.code == 500) {
        toast(res.msg)
        setIsLoading(false)
        return;
      }
      
      if (res.code == 200) {
        //await AsyncStorage.setItem('user', JSON.stringify(res.user))
        await AsyncStorage.setItem('token', res.token)
      }
      authContext.logIn(res.user)
    } catch (err) {
      toast(`Something went wrong, check your internet connection and try again. ${err}`)
      
      setIsLoading(false)
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
        paddingHorizontal: 20,
        paddingVertical: 20,
        
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color='white'/>
        </TouchableOpacity>
      </View>
      
      <Text style={{
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 20,
        color: '#6a69fe',
      }}>Welcome back</Text>
      
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7.5,
        width: '89%',
      }}>
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          marginHorizontal: 10,
        }}>Email</Text>
        <TextInput 
          inputType='email'
          placeholderTextColor='darkgray' 
          placeholder='Enter your email'
          keyboardType='email-adress'
          value={email}
          onChangeText={(value) => setEmail(value)}
          style={{
            width: '100%',
            height: 45,
            borderRadius: 50,
            backgroundColor: '#1d1d1d',
            paddingHorizontal: 15,
            color: 'white',
            marginBottom: 10,
          }}
        />
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          marginHorizontal: 10,
        }}>Password</Text>
        <TextInput 
          inputType='password' 
          placeholder='Enter your password' 
          placeholderTextColor='darkgray'
          value={password}
          secureTextEntry
          onChangeText={(value) => setPassword(value)}
          style={{
            width: '100%',
            paddingHorizontal: 15,
            color: 'white',
            height: 45,
            borderRadius: 50,
            backgroundColor: '#1d1d1d',
            marginBottom: 10,
          }}
        />
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
          <Button 
            title='Reset password' 
            style={{
              width: '48%',
              height: 45,
              margin: 0,
              backgroundColor: '#262626',
            }}
          />
          <Button 
            title='Login' 
            loading={isLoading}
            onPress={login}
            style={{
              width: '48%',
              height: 45,
              margin: 0,
            }}
            loading_msg={'Wait...'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});

export default Login;