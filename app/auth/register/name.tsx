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
import { useCustomAlert } from '@/hooks/alert'

const checkCode = () => {
  const authContext = useContext(AuthContext)
  const [name, setName] = useState(authContext.tempUserData.name)
  const [isLoading, setisLoading] = useState(false)
  const alert = useCustomAlert()
  
  function hasAnyAlphabet(text) {
    return /\p{L}/u.test(text)
  }
  
  const send_code = async () => {
    if (!name) {
      return
    }
    console.log(hasAnyAlphabet(name));
    if (!hasAnyAlphabet(name)) {
      return alert('Invalid', 'Invalid character detected, please write at least 5 alphabetic letters', [{text: 'Ok', primary:true}])
    }
    const insert = authContext.insertIntoTemp(name, 'name')
    if (insert.ok) {
      router.push('/auth/register/username')
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
      }}>What's your name</Text>
      
      <Text style={{
        fontSize: 13,
        marginTop: 10,
        color: 'white',
      }}>Add a name to your new account.</Text>
      
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
        }}>Name</Text>
        <TextInput 
          placeholderTextColor='darkgray' 
          placeholder='eg. Alex Olsen'
          value={name}
          cursorColor='#6a69fe'
          selectionColor="#6a69fe"
          autoFocus
          onChangeText={(value) => setName(value)}
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
        <Button onPress={send_code} title='Next' loading={isLoading} loading_msg='Submitting'/> 
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