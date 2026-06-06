import Image from '../../../../../components/reusables/Image';
import Header from '@/components/header';
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { VideoIcon, MicOff02Icon, VolumeHighIcon,  CallEnd04Icon, Video02Icon, UserAdd02Icon, ArrowShrink02Icon, StarsIcon } from '@hugeicons/core-free-icons';
import { Ellipsis, ArrowLeft } from 'lucide-react-native'
import { useState, useEffect } from 'react'
import haptics from '@/hooks/haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'

const Audio = ({visible, onClose, chat}) => {
  const [isStrongSound, setisStrongSound] = useState(false)
  const [isMicOff, setisMicOff] = useState(false)
  const { handleViber } = haptics()
  const [callState, setCallState] = useState('Calling...')
  const { chat_name, avatar, chat_id } = useLocalSearchParams()
  
  useEffect(() => {
    setTimeout(() => {
      setCallState('Ringing...')
    }, 3000);
  }, [])
  
  useEffect(() => {
    setTimeout(() => {
      
    }, 5000);
  }, [callState])
  
  
  return (
    <LinearGradient
      colors={[
        '#1b1a3c', 
        '#0a0a0a',
      ]} 
      start={{ x:0, y:1 }} 
      end={{x: 0, y:0 }} 
      style={{
        flex: 1
      }}
    >
      <Header isBack/>
      <View style={{
        flex: 1,
        alignItems: 'center',
      }}>
        <Image size={80} src={avatar}/>
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
        }}>{chat_name}</Text>
      </View>
    </LinearGradient>
  );
};

export default Audio;