import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Pressable, Keyboard, FlatList, TouchableWithoutFeedback, ScrollView, Alert, ImageBackground } from 'react-native';
import Header from '@/components/header'
import { ArrowLeft, Phone, PlusCircle, Smile, AudioLines, SendHorizontal, ArrowUp, CheckCheck } from 'lucide-react-native'
import { router } from 'expo-router'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ImageIcon, MicIcon, SettingsIcon, VideoIcon, ImagesIcon, CallAdd02Icon, AudioWave01Icon, Mic02Icon, AddCircleIcon, SmileIcon, SentIcon, Check01Icon } from '@hugeicons/core-free-icons';
import { useState, useEffect, useRef } from 'react'
import haptics from '../../../../hooks/haptics.js'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stack } from 'expo-router';
import { useKeyboard } from '../../../../hooks/keyboard.js';
import Message from '@/components/reusables/message'
import MsgFocus from '@/components/modal_pages/msg_focus'
import Audio from '@/components/modal_pages/call/audio'

const Chat = () => {
  const { handleViber } = haptics()
  const insets = useSafeAreaInsets()
  const { keyboardHeight, isKeyboardOpen } = useKeyboard()
  const [selected_msg_for_focus_mode, setSelected_msg_for_focus_mode] = useState(null)
  const [input, setinput] = useState('')
  const [logged_user, setLoggedUser] = useState(3)
  const [actual_sender, setActual_sender] = useState(5)
  const [audio_call_modal, setAudio_call_modal] = useState(false)
  const [kHeight, setKHeight] = useState(null)
  
  useEffect(() => {
    if (keyboardHeight) {
      setKHeight(keyboardHeight)
    }else{
      setKHeight(null)
    }
  }, [isKeyboardOpen])
  
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hey, btw how have u been since then',
      sender_id: 3,
      timestamp: '8:10PM',
      to_id: 5,
      reactions: []
    },
    {
      id: 2,
      content: "Huh, to be honest, I don't really know, why don't you come over and talk about it",
      sender_id: 5,
      timestamp: '8:11PM',
      to_id: 3,
      reactions: ['😁']
    },
  ])
  const flatListRef = useRef(null);
  
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const addValue = (val) => {
    function hasAnyAlphabet(input) {
      const test = /\p{L}/u.test(input);
      if (test) {
        return 'emoji'
      }
      return 'text'
    }
    setMessages((prev) => {
      const newOne = {
        id: messages.length + 1,
        content: val || input,
        sender_id: actual_sender == logged_user? 5 : logged_user,
        timestamp: '8:11PM',
        type: hasAnyAlphabet || 'text',
        to_id: actual_sender == logged_user? 5 : logged_user,
        reactions: []
      }
      return [...prev, newOne]
    })
    flatListRef.current.scrollToEnd({ animated: true });
    setActual_sender((prev) => actual_sender == logged_user? 5 : logged_user)
  }
  
  return (
    <ImageBackground source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ_wXo5gRE7vn6iAFHcPRbmRsVL9V0U-9ZMXcFolP10Q&s=10'}} resizeMode='cover' style={{
      ...styles.container,
    }}>
      <Stack.Screen
        options={{
          headerShown: true
        }}
      />
      {selected_msg_for_focus_mode &&
        <MsgFocus 
          msg={selected_msg_for_focus_mode}
          user={logged_user}
          actionTaken={(value) => {
            if (value == 'delete') {
              setMessages((prev) => prev.filter(msg => msg.id !== selected_msg_for_focus_mode.id))
            }
            if (value?.type == 'reaction') {
              setMessages((prev) => {
                const find = prev.findIndex(m => m.id === selected_msg_for_focus_mode.id)
                console.log(find);
                prev[find].reactions.push(value?.value)
                console.log(prev);
                return prev
              })
            }
            setSelected_msg_for_focus_mode(null)
          }}
          onClose={() => setSelected_msg_for_focus_mode(null)}
        />
      }
      <Header headerLeft={
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color='white'/>
          </TouchableOpacity>
          <View
            style={{
              height: 33,
              width: 33,
              borderRadius: 50,
              backgroundColor: '#262626',
            }}
          ></View>
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <Text style={{
              color: 'white',
              fontWeight: 'bold',
            }}>John Doe</Text>
            <Text style={{
              fontSize: 10,
              color: 'darkgray',
            }}>Last seen online 8:19AM</Text>
          </View>
        </View>
      }
      headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 16
        }}>
          <TouchableOpacity key={1} onPress={() => {
            setAudio_call_modal(true)
            handleViber.Medium()
          }}>
            <HugeiconsIcon color='white' icon={CallAdd02Icon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/pages/chat/settings')} key={2}>
            <HugeiconsIcon icon={SettingsIcon} color='white'/>
          </TouchableOpacity>
        </View>
      }
      headerRightStyle={{
        padding: 0,
      }}
      />
      <Audio 
        visible={audio_call_modal}
        onClose={() => setAudio_call_modal(false)}
      />
      {/*<Text className='text-white'>Chat</Text>*/}
      <FlatList 
        data={messages}
        keyExtractor={(item) => item.id}
        style={{
          flex: 1,
        }}
        ref={flatListRef}
        renderItem={({ item }) => (
          <Message 
            logged_user={logged_user} 
            item={item}
            onLongPress={() => {
              setSelected_msg_for_focus_mode(item)
            }}
          />
        )}
      />
        {/*<View style={{
          height: 20,
          width: 20,
          backgroundColor: 'white',
        }}></View>*/}
      
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //placeItems: 'end',
        marginTop: 8.5,
        marginBottom: insets.bottom? (insets.bottom + 10) : 8.5 || 8.5,
        gap: 6,
      }}>
        <View style={{
          width: '83%',
          borderRadius: 25,
          minHeight: 45,
          backgroundColor: '#262626',
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}>
          <HugeiconsIcon icon={AddCircleIcon} color='white'/>
          <TextInput maxHeight={100} value={input} onChangeText={(val) => setinput(val)} placeholderTextColor='darkgray' multiline placeholder='Type a message...' style={{
            flex: 1,
            color: 'white',
          }}/>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15
          }}>
            <HugeiconsIcon 
              icon={SmileIcon} 
              color='white'
              style={{
                marginRight: 30,
              }}
            />
            {!input && <HugeiconsIcon icon={Mic02Icon} color='white'/>}
          </View>
        </View>
        <Pressable onPress={async() => {
          input && await handleViber.Light()
          input && setinput('')
          input && addValue()
        }} style={{
          height: 45,
          width: 45,
          backgroundColor: '#6a69fe',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 50,
          opacity: input? 1 : .5,
          transition: '0.3s',
          paddingTop: 2.5,
          paddingRight: 2.5,
        }}>
          <HugeiconsIcon 
            icon={SentIcon} 
            fill={input? 'white' : 'transparent'}
            color={input? '#6a69fe' : 'white'}
            size={input? 27 : 23}
          />
        </Pressable>
      </View>
      <View
        style={{
          height: kHeight ?? 0,
        }}
      ></View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderWidth: 0,
  },

});

export default Chat;