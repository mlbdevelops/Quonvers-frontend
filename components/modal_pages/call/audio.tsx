import Image from '../../reusables/Image';
import Header from '@/components/header';
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { VideoIcon, MicOff02Icon, VolumeHighIcon,  CallEnd04Icon, Video02Icon, UserAdd02Icon, ArrowShrink02Icon, StarsIcon } from '@hugeicons/core-free-icons';
import { Ellipsis, ArrowLeft } from 'lucide-react-native'
import { useState, useEffect } from 'react'
import haptics from '@/hooks/haptics'
import { LinearGradient } from 'expo-linear-gradient'

const Audio = ({visible, onClose, chat}) => {
  const [isStrongSound, setisStrongSound] = useState(false)
  const [isMicOff, setisMicOff] = useState(false)
  const { handleViber } = haptics()
  const [callState, setCallState] = useState('Calling...')
  const { name: chat_name, avatar, chat_id, wall } = chat
  
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
    <Modal visible={visible} onRequestClose={onClose} animationType='fade'>
      <LinearGradient
        colors={[
          '#1b1a3c', 
          '#0a0a0a',
        ]} 
        start={{ x:0, y:1 }} 
        end={{x: 0, y:0 }} 
        style={{
          flex: 1,
        }}
      >
        <Header isBack/>
      </LinearGradient>
    </Modal>
  );
};

export default Audio;