import Image from '../../reusables/Image';
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { VideoIcon, MicOff02Icon, VolumeHighIcon,  CallEnd04Icon, Video02Icon, UserAdd02Icon, ArrowShrink02Icon, StarsIcon } from '@hugeicons/core-free-icons';
import { Ellipsis, ArrowLeft } from 'lucide-react-native'
import { useState, useEffect } from 'react'
import haptics from '@/hooks/haptics'

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
      <ImageBackground containerStyle={{
        backgroundColor: 'red',
      }} source={require('../../../assets/onboarding/1778518071391.jpg')} resizeMode='' style={{
        flex: 1,
      }}>
      <View style={{
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'space-between',
        ...styles.container
      }}>
        <View style={{
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          gap: 5,
          marginTop: 5,
        }}>
          <View style={{
            width: '100%',
            //padding: 10,
            //height: 20,
            paddingVertical: 5,
            marginBottom: 50,
            marginTop: 23,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //borderWidth: 1,
            //borderColor: 'white',
          }}>
            <TouchableOpacity onPress={onClose} style={{
              //backgroundColor: '#1d1d1d',
              borderRadius: 21,
              //height: 50,
              ///width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ArrowLeft
                color='white'
                //icon={ArrowShrink02Icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                handleViber.Medium()
              }} style={{
                //backgroundColor: '#1d1d1d',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                borderRadius: 50,
                height: 25,
                width: 25,
                borderWidth: 1.5,
                borderColor: 'white',
              }}
            >
              <Ellipsis size={17.5} color='white' />
            </TouchableOpacity>
          </View>
          
          <View ></View>
          
          <Image src={avatar} style={{
            height: 150,
            width: 150,
            borderRadius: 300,
            backgroundColor: '#262626',
          }}/>
          
          <TouchableOpacity style={{
            gap: 5,
            alignItems: 'center',
          }}>
            <Text style={{
              color: 'white',
              fontSize: 30,
              fontWeight: 'bold',
              marginTop: 5,
            }}>{chat_name}</Text>
          </TouchableOpacity>
          <Text style={{
            color: 'darkgray',
            //fontWeight: 'bold',
            fontSize: 15,
            marginTop: 3,
          }}>{callState}</Text>
        </View>
        <View style={{
          height: 71,
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#171717',
          borderRadius: 24.5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          //borderWidth: 1,
          //borderColor: '#111111',
        }}>
          <TouchableOpacity style={{
            backgroundColor: '#262626',
            borderRadius: 21,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HugeiconsIcon 
              color='white'
              icon={StarsIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: '#262626',
            borderRadius: 21,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HugeiconsIcon 
              color='white'
              icon={Video02Icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={ async() => {
            await handleViber.Light()
            setisStrongSound((prev) => !prev)
          }} style={{
            backgroundColor: isStrongSound? '#6a69fe' : '#262626',
            borderRadius: 21,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HugeiconsIcon 
              color='white'
              icon={VolumeHighIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={ async () => {
            await handleViber.Light()
            setisMicOff((prev) => !prev)
          }} style={{
            backgroundColor: isMicOff? '#6a69fe' : '#262626',
            borderRadius: 21,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HugeiconsIcon 
              color={'white'}
              icon={MicOff02Icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            setisStrongSound(false)
            setisMicOff(false)
            onClose()
            await handleViber.Light()
          }} style={{
            backgroundColor: '#ff63471d',
            borderRadius: 21,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HugeiconsIcon 
              color='tomato'
              fill='tomato'
              icon={CallEnd04Icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingVertical: 20,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: '#000000',
    flexDirection: 'column',
  },
});

export default Audio;