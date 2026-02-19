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
import { Button as NativeButton } from 'react-native'
//import DatePicker from 'react-native-date-picker'

const checkCode = () => {
  const authContext = useContext(AuthContext)
  const [isLoading, setisLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const [day, setDay] = useState(null)
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  
  const insert_age = async () => {
    const age = `${year}-${month}-${day}`
    if (!age) {
      return
    }
    const insert = authContext.insert_into_temp(age, 'birthdate')
    if (insert.ok) {
      router.push('/auth/register/passw')
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
      
      {/*<NativeButton title="Open" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />*/}
      <Text style={{
        fontSize: 27,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#6a69fe',
      }}>How old are you</Text>
      
      <Text style={{
        fontSize: 13,
        marginTop: 10,
        color: 'white',
      }}>Enter your age in order to confirm your identity.</Text>
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
        }}>Age</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 5
        }}>
          <TextInput 
            placeholderTextColor='darkgray' 
            placeholder='Day'
            maxLength={2}
            value={day}
            keyboardType='numeric'
            onChangeText={(value) => {
              setDay(value.trim())
            }}
            style={{
              width: '32%',
              height: 45,
              borderRadius: 50,
              backgroundColor: '#1d1d1d',
              paddingHorizontal: 15,
              color: 'white',
              marginBottom: 5,
            }}
          />
          <TextInput 
            placeholderTextColor='darkgray' 
            placeholder='Month'
            value={month}
            maxLength={2}
            keyboardType='numeric'
            onChangeText={(value) => {
              setMonth(value.trim())
            }}
            style={{
              width: '32%',
              height: 45,
              borderRadius: 50,
              backgroundColor: '#1d1d1d',
              paddingHorizontal: 15,
              color: 'white',
              marginBottom: 5,
            }}
          />
          <TextInput 
            placeholderTextColor='darkgray' 
            placeholder='Year'
            keyboardType='numeric'
            value={year}
            maxLength={4}
            onChangeText={(value) => {
              setYear(value.trim())
            }}
            style={{
              width: '32%',
              height: 45,
              borderRadius: 50,
              backgroundColor: '#1d1d1d',
              paddingHorizontal: 15,
              color: 'white',
              marginBottom: 5,
            }}
          />
        </View>
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Button onPress={() => router.back()} title='Previous' loading={false} style={{
            width: '48.5%',
            backgroundColor: '#262626',
          }}/> 
          <Button onPress={insert_age} title='Next' loading={isLoading} loading_msg='Submitting' style={{
              width: '48.5%',
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