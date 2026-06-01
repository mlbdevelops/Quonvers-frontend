//import Image from '@/components/reusables/Image';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, Image, Pressable } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Eye, EyeClosed } from 'lucide-react-native'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Button from '@/components/reusables/button.tsx'
import trans from '@/hooks/fetch'
import haptics from '@/hooks/haptics'
import { useCustomAlert } from '@/hooks/alert'
import { storage } from '@/storage/mmkv'

const Login = () => {
  const sprms = useLocalSearchParams()
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState(sprms.email || '')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const alert = useCustomAlert()
  const [wrong_pass_attempts, setAttempts] = useState<number>(0)
  const [showPassword, setshowPassword] = useState<boolean>(false)
  const { handleViber } = haptics()
  
  const login = async () => {
    try {
      if (!email || !password) {
        return;
      }
      setIsLoading(true);
      Keyboard.dismiss()
      const res = await trans('/api/auth/login', {
        headers: {
          'Content-Type' : 'application/json'
        },
        body: {email, password}
      })
      if (res.code == 803) {
        setAttempts(wrong_pass_attempts + 1)
        if(wrong_pass_attempts >= 2){
          alert(null, 'The password entered is wrong, we recommend to reset your account password or contact us if you encounter any login issues.', [
            {text: 'Contact us', primary : false},
            {text: 'Try again', primary : false},
            {text: 'Reset password', primary: true}
          ])
        }else{
          alert(null, 'the password entered is wrong.', [
            {text: 'Try again', primary: true},
          ])
        }
        
        setIsLoading(false)
        return;
      };
      if (res.code == 807) {
        alert(null, <>No user found with email <Text style={{
          color: '#6a69fe',
        }}>{email}</Text></>, [
          { text: 'Sign up', onPress: () => router.replace('/auth/register') },
          { text: 'Try again', primary: true},
        ])
        setIsLoading(false)
        return;
      }
      
      if (res.code == 500) {
        toast(res.msg)
        setIsLoading(false)
        return;
      }
      
      if (res.code == 200) {
        await storage.set('token', res.token)
        authContext.logIn(res.user)
      }
    } catch (err) {
      toast(`An error occured, please try again`)
      setIsLoading(false)
      //console.error(err);
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
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
        <TouchableOpacity onPress={() => isLoading? toast("Wait while loading...") : router.back()}>
          <ArrowLeft color='white'/>
        </TouchableOpacity>
        <Pressable style={{
          opacity: isLoading? .5 : 1,
        }} onPress={() => !isLoading && router.replace({
          pathname: '/auth/register',
          params: {
            email
          }
        })}>
          <Text style={{
            color: '#6a69fe',
            fontWeight: 'bold',
            fontSize: 16,
          }}>Sign up</Text>
        </Pressable>
      </View>
      
      <View style={{
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
        alignItems: 'center',
      }}>
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          width: '89%',
        }}>
          <View style={{
            //flexDirection: 'row',
            marginBottom: 15,
            marginTop: 5,
            //borderWidth: 1,
            borderColor: 'red',
            width: '100%',
          }}>
            <Image style={{
              height: 39,
              width: 39,
              display: 'none',
            }} source={require('../../assets/images/icon@3.png')}/>
            <Text style={{
              fontSize: 27,
              fontWeight: 'bold',
              marginTop: 10,
              color: '#6a69fe',
            }}>Login</Text>
            
            <Text style={{
              fontSize: 13,
              marginTop: 10,
              color: 'white',
            }}>Login to your existing quonvers account using your email and password.</Text>
          </View>
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            //marginHorizontal: 10,
            //display: 'none',
          }}>Email</Text>
          <TextInput 
            inputType='email'
            placeholderTextColor='darkgray' 
            placeholder='Enter your email or username'
            autoCapitalize={'none'}
            keyboardType='email-adress'
            value={email}
            cursorColor='#6a69fe'
            selectionColor="#6a69fe"
            onChangeText={(value) => setEmail(value)}
            style={{
              width: '100%',
              height: 45,
              borderRadius: 15,
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
            //marginHorizontal: 10,
            //display: 'none',
          }}>Password</Text>
          
          <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            //backgroundColor: '#1d1d1d',
            marginBottom: 10,
          }}>
            <TextInput 
              inputType='password' 
              placeholder='Enter your password' 
              placeholderTextColor='darkgray'
              value={password}
              secureTextEntry={!showPassword}
              cursorColor='#6a69fe'
              selectionColor="#6a69fe"
              onChangeText={(value) => setPassword(value)}
              style={{
                flex: 1,
                paddingHorizontal: 15,
                color: 'white',
                height: 45,
                borderTopLeftRadius: 15,
                borderBottomLeftRadius: 15,
                backgroundColor: '#1d1d1d',
                //marginTop: 5,
              }}
            />
            <TouchableOpacity onPress={() => {
              setshowPassword((prev) => !prev)
              handleViber.Light()
            }} style={{
              height: 45,
              backgroundColor: '#1d1d1d',
              width: 45,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {showPassword? <EyeClosed color='white' size={20}/> : <Eye color='white' size={20}/>}
            </TouchableOpacity>
          </View>
          <Button 
            title='Login' 
            loading={isLoading}
            onPress={login}
            style={{
              width: '100%',
              height: 45,
              margin: 0,
              opacity: !email || !password? .5 : isLoading? .5 : 1,
            }}
          />
        </View>
        <Button 
          title='Forgot password' 
          style={{
            color:'#6a69fe',
            backgroundColor: 'transparent',
            marginVertical: 20,
          }}
        />
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