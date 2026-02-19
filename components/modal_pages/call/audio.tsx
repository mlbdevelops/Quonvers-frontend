import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { VideoIcon, MicOff02Icon, VolumeHighIcon,  CallEnd04Icon, Video02Icon, UserAdd02Icon, ArrowShrink02Icon } from '@hugeicons/core-free-icons';
import { Ellipsis } from 'lucide-react-native'
import { useState, useEffect } from 'react'
import haptics from '@/hooks/haptics'

const Audio = ({visible, onClose}) => {
  const [isStrongSound, setisStrongSound] = useState(false)
  const [isMicOff, setisMicOff] = useState(false)
  const { handleViber } = haptics()
  return (
    <Modal visible={visible} animationType='fade'>
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
            padding: 10,
            //height: 20,
            paddingVertical: 5,
            marginBottom: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity onPress={onClose} style={{
              backgroundColor: '#1d1d1d',
              borderRadius: 50,
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HugeiconsIcon 
                color='white'
                icon={ArrowShrink02Icon}
              />
            </TouchableOpacity>
          </View>
          <View style={{
            height: 150,
            width: 150,
            borderRadius: 300,
            backgroundColor: '#262626',
          }}></View>
          <TouchableOpacity style={{
            gap: 5,
            alignItems: 'center',
          }}>
            <Text style={{
              color: 'white',
              fontSize: 30,
              fontWeight: 'bold',
              marginTop: 5,
            }}>Elon musk</Text>
          </TouchableOpacity>
          <Text style={{
            color: 'darkgray',
            //fontWeight: 'bold',
            fontSize: 20,
            marginTop: 3,
          }}>0:03</Text>
        </View>
        <View style={{
          height: 71,
          width: '100%',
          backgroundColor: '#1d1d1d43',
          borderRadius: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          borderWidth: 1,
          borderColor: '#111111',
        }}>
          <TouchableOpacity style={{
            backgroundColor: '#1d1d1d',
            borderRadius: 50,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HugeiconsIcon 
              color='white'
              icon={UserAdd02Icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: '#1d1d1d',
            borderRadius: 50,
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
            backgroundColor: isStrongSound? '#6a69fe' : '#1d1d1d',
            borderRadius: 50,
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
            backgroundColor: isMicOff? '#6a69fe' : '#1d1d1d',
            borderRadius: 50,
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
            backgroundColor: '#1d1d1d',
            borderRadius: 50,
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: 'black',
    flexDirection: 'column',
  },
});

export default Audio;