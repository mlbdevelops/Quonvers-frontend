import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react'
import { UserRoundPlus, KeyRound } from 'lucide-react-native'
import { router } from 'expo-router'
import FadeInView from '@/components/reusables/fadeInView'
import StarsBackground from '@/components/onboardings/auth_bg_dots'
import CharacterAnimation from '@/components/onboardings/character_animation'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
  MailIcon
} from '@hugeicons/core-free-icons';

export default function Authenticate() {
  const [text, setText] = useState('Quonvers');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = [
    'Quonvers',
    'Explore',
    'Meet',
    'Feel',
  ];
  
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
      {/*
      <CharacterAnimation/>
      <StarsBackground/>
      */}
      <View style={styles.body}>
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          //marginTop: ,
        }}>
          <Image style={{
            height: 100,
            width: 100,
          }} source={require('../assets/images/icon@2.png')}/>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
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
        </View>
        
        <View style={styles.optionsView}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <TouchableOpacity onPress={() => router.push('/auth/register')} style={{...styles.option, alignItems: 'center', justifyContent: 'center', gap: 8}}>
              
              {/*<HugeiconsIcon color='white' icon={MailIcon}/>*/}
              
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
              }}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/auth')} style={{...styles.option, alignItems: 'center', justifyContent: 'center', gap: 8}}>
              {/*<HugeiconsIcon color='white' icon={MailIcon}/>
                
              <View style={{...styles.icon}}>
                <KeyRound color='#6a69fe' size={17}/>
              </View>
                */}
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
              }}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dividerContainer}>
            <View style={styles.divider}></View>
            <Text style={{
              color: 'darkgray',
            }}>Or continue with</Text>
            <View style={styles.divider}></View>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity onPress={signInWithGoogle} style={{...styles.option}}>
               {/*<View style={{fontSize: 20, ...styles.icon}}>
               <Text style={{
                color: '#6a69fe',
                fontWeight: 'bold',
                fontSize: 25,
                }}>G</Text>
              </View>*/}
              <Image style={{
                height: 27,
                width: 27,
              }} source={require('../assets/images/google_logo.png')}/>
              <Text style={{color:'white', marginLeft: 4,}}> <Text style={{fontWeight: 'bold'}}>Google</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signInWithGoogle} style={{...styles.option}}>
              
              <Image style={{
                height: 27,
                width: 27,
              }} source={require('../assets/images/fb_logo.png')}/>
              <Text style={{color:'white', marginLeft: 7,}}><Text style={{fontWeight: 'bold'}}>Facebook</Text></Text>
            </TouchableOpacity>
          </View>
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
    width: '48%',
    height: 45,
    borderRadius: 50,
    backgroundColor: '#1d1d1dbd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: 3
  },
  
  icon:{
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    width: '30%',
    backgroundColor: '#2c2c2c',
    height: 1,
    borderRadius: 50,
  }
})