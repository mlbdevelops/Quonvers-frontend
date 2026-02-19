import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react'
import { UserRoundPlus, KeyRound } from 'lucide-react-native'
import { router } from 'expo-router'
import FadeInView from '@/components/reusables/fadeInView'
import StarsBackground from '@/components/auth_bg_dots'

export default function Authenticate() {
  const [text, setText] = useState('Quonvers');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ['Quonvers', 'Chat', 'Meet', 'Explore'];
  
  async function signInWithGoogle() {
    //setLoad(true)
    /*try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:4000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json()
      
      if (!res.ok) {
        setNotif({
          error: true,
          msg: data.msg,
          title: 'Google error'
        })
        setLoad(false)
      }
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', JSON.stringify(data.token))
        location.reload()
      }
      
    } catch (error) {
      setNotif({
        error: true,
        msg: `Oops, something bad happened, check your network connection and try again, if the problem persists contact us.`,
        title: 'Google error'
      })
      setLoad(false)
    }*/
  }
  
  useEffect(() => {
    const currentWord = words[wordIndex];
    const typingSpeed = 50;
    const deletingSpeed = 30;
    const wordDelay = 1200;
    let timer;
    
    if (!isDeleting && text.length < currentWord.length) {
      timer = setTimeout(() => {
        setText(prev => prev + currentWord[text.length]);
      }, typingSpeed);
    } else if (isDeleting && text.length > 0) {
      timer = setTimeout(() => {
        setText(prev => prev.substring(0, prev.length - 1));
      }, deletingSpeed);
    } else if (!isDeleting && text.length === currentWord.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, wordDelay);
    } else if (isDeleting && text.length === 0) {
    setIsDeleting(false);
    setWordIndex(prev => (prev + 1) % words.length);
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words]);
  
  
  return(
    <View style={styles.back}>
      <StarsBackground/>
      <View style={styles.body}>
        {/*load && <Load/>}
        {notif && notif.title && <Confirm
          msg={notif.msg}
          title={notif.title}
          onClose={() => setNotif({})}
          onSubmit={() => setNotif({})}
          cancel
          cancel_button_text='Report'
          submit_button_text='Try again'
        />*/}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          marginTop: 50,
        }}>
          <Text 
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              color: 'white',
            }}
          >{text}</Text>
          <FadeInView duration={400}>
            <View style={{
              height: 40,
              width: 3.5,
              backgroundColor: 'white',
              borderRadius: 1,
            }}></View>
          </FadeInView>
        </View>
        
        <View style={styles.optionsView}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <TouchableOpacity onPress={() => router.push('/auth/register')} style={{...styles.option, width: '49%'}}>
              <View style={styles.icon}>
                <UserRoundPlus color='#6a69fe' size={17}/>
              </View>
              <Text style={{
                color: 'white',
              }}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/auth')} style={{...styles.option, width: '49%'}}>
              <View style={styles.icon}>
                <KeyRound color='#6a69fe' size={17}/>
              </View>
              <Text style={{
                color: 'white',
              }}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dividerContainer}>
            <View style={styles.divider}></View>
            <Text style={{
              color: 'darkgray',
            }}>Or</Text>
            <View style={styles.divider}></View>
          </View>
          <TouchableOpacity onPress={signInWithGoogle} style={styles.option}>
            <View style={{fontSize: 20, ...styles.icon}}>
              {/*<Text style={{
              color: '#6a69fe',
              fontWeight: 'bold',
              fontSize: 25,
              }}>G</Text>*/}
              <Image style={{
                height: 42,
                width: 42,
              }} source={require('../assets/images/google_logo.png')}/>
            </View>
            <Text style={{color:'white'}}>Continue with <Text style={{fontWeight: 'bold'}}>Google</Text></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signInWithGoogle} style={styles.option}>
            <View style={{...styles.icon}}>
              <View style={{
                backgroundColor: '#1771ff',
                height: 35,
                width: 35,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                overflow: 'hidden',
                transform: 'scale(.9)',
              }}>
                <Text style={{
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 36,
                }}>f</Text>
              </View>
            </View>
            <Text style={{color:'white'}}>Continue with <Text style={{fontWeight: 'bold'}}>Facebook</Text></Text>
          </TouchableOpacity>
          <Text className='text-center text-[12px] pl-2 pr-2 text-white mt-2'>
            By continuing, you're agree to our <Text className='text-[#6a69fe] font-bold'>
            Privacy policy</Text> and <Text className='text-[#6a69fe] font-bold'>
            Terms of use</Text>
          </Text>
        </View>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  body:{
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  title: {
    fontSize: 20,
  },
  
  optionsView:{
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
    width: '100%',
    paddingHorizontal: 5,
  },
  
  option: {
    width: '100%',
    height: 45,
    borderRadius: 50,
    backgroundColor: '#1d1d1dbd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 3,
  },
  
  icon:{
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50,
  },
  
  dividerContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  
  divider: {
    width: '40%',
    backgroundColor: '#2c2c2c',
    height: 1,
    borderRadius: 50,
  }
})