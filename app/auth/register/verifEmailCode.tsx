import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AuthContext } from '@/utils/authContext'
import { useContext, useState, useEffect, useRef } from 'react'
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
  const [isLoading, setisLoading] = useState(false)
  const [isResendCodeLoadingButton, setisResendCodeLoadingButton] = useState(false)
  const [stopLoad, setStopLoad] = useState(false)
  const email = authContext.tempUserData.email
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const alert = useCustomAlert()
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) {
      const pasted = text.replace(/[^0-9]/g, "").slice(0, 6).split("");
      const newOtp = [...otp];

      pasted.forEach((digit, i) => {
        newOtp[i] = digit;
        if (inputs.current[i]) {
          inputs.current[i].setNativeProps({ text: digit });
        }
      });
      setOtp(newOtp);
      const nextIndex = pasted.length >= 6 ? 5 : pasted.length;
      inputs.current[nextIndex]?.focus();
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
  
  const resend_code = async () => {
    try {
      if (!email) {
        return
      }
      setisResendCodeLoadingButton(true)
      const res = await trans('/api/verification/send/email', {
        body: { email },
        headers: {'Content-Type': 'application/json'}
      })
      if (res.status == 201) {
        setisResendCodeLoadingButton(false)
        alert(null, `Code sent to ${email}, Check it and enter it here.`, [{text: 'Ok', primary: true}])
      }
    } catch (error) {
      alert('Error', 'Error sending the code, check your internet connection and try again.', [{text: 'Ok', primary: true}])
    }
  }

  const send_code = async () => {
    try {
      if (!email || otp.length < 6) {
        return
      }
      setisLoading(true)
      const res = await trans('/api/verification/check/email', {
        body: { email, code: otp.join('') },
        headers: {'Content-Type': 'application/json'}
      })
      
      if (res.success) {
        setisLoading(false)
        if (!email) {
          return
        }
        router.replace('/auth/register/name')
      }else{
        alert(null, 'The code entered is invalid', [{
          text: 'Try again',
          primary: true,
        }])
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
      }}>Enter the code sent to <Text style={{
        color: '#6a69fe',
      }}>{email}</Text>, The code expires in 10 minutes.</Text>
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
        }}>Code</Text>
        <View style={styles.otpCont}>
          {otp.map((digit, index) => {
            const [focused, setFocused] = useState(false)
            
            return(
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={{...styles.input, borderWidth: focused? 2 : 1, borderColor: focused? '#6a69fe' : '#262626', transition: '0.3s'}}
                keyboardType="number-pad"
                maxLength={1}
                autoComplete="sms-otp"
                value={digit}
                cursorColor='transparent'
                onFocus={() => setFocused(true)}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => {
                  handleBackspace(e, index)
                  setFocused(false)
                }}
              />
            )
          })}
        </View>
        <Button 
          style={{
            marginTop: 10,
          }} 
          onPress={send_code} 
          title='Submit' 
          loading={isLoading} 
          loading_msg='Submitting'
        /> 
        
        <Button 
          loading={isResendCodeLoadingButton} 
          onPress={resend_code} 
          title="Didn't receive the code?"
          style={{
            backgroundColor: 'transparent',
            color: '#6a69fe',
          }}
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
    gap: 4
  },
  otpCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 15,
    textAlign: "center",
    fontSize: 18,
    borderColor: '#262626',
    color: 'white',
  },
});

export default checkCode;