//import UseMediaPicker from '../../../quonvers_mob/frontend/hooks/UseMediaPicker';
import Image from '@/components/reusables/Image';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Pressable, Keyboard, FlatList, TouchableWithoutFeedback, ScrollView, Alert, ImageBackground, ActivityIndicator, BackHandler } from 'react-native';
import Header from '@/components/header'
import { ArrowLeft, Phone, PlusCircle, Smile, AudioLines, SendHorizontal, ArrowUp, CheckCheck } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image02Icon, MicIcon, SettingsIcon, VideoIcon, ImagesIcon, CallAdd02Icon, AudioWave01Icon, Mic02Icon, AddCircleIcon, SmileIcon, SentIcon, Check01Icon, CameraIcon, AddIcon, Unlink04Icon } from '@hugeicons/core-free-icons';
import { useState, useEffect, useRef, useContext } from 'react'
import haptics from '@/hooks/haptics'
import trans from '@/hooks/fetch'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stack } from 'expo-router';
import { useKeyboard } from '@/hooks/keyboard';
import Message from '@/components/reusables/message'
import Button from '@/components/reusables/button'
import MsgFocus from '@/components/modal_pages/msg_focus'
import MessagesOptions from '@/components/modal_pages/chat_send_messages_options'
import Audio from '@/components/modal_pages/call/audio'
import { useAnimatedKeyboard } from "react-native-keyboard-controller";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { localMsgStore, deleteMessage, sendMessage } from '@/utils/MessageServices/index'
import { storage } from '@/storage/mmkv'
import shouldShowAvatar from '@/utils/logics/is_same_sender'
import { socket } from '@/hooks/sockets/socket_provider'
import { getMessages } from '@/utils/MessageServices/GetMesages'
import { ChatContext } from '@/contexts/chatContext'
import { useCustomAlert } from '@/hooks/alert'
import { UseMediaPicker } from '@/hooks/useMediaPicker'
import { FlashList } from '@shopify/flash-list'
import AppEvent, { Events } from '@/utils/eventEmitter';
import { MessageStatus } from '@/utils/MessageServices'
import Info from '@/components/chat/info'

const Chat = () => {
  const context = useContext(ChatContext)
  const { handleViber } = haptics()
  const [isReady, setIsReady] = useState<boolean>(false)
  const { height, progress } = useAnimatedKeyboard();
  const insets = useSafeAreaInsets()
  const { keyboardHeight, isKeyboardOpen } = useKeyboard()
  const alert = useCustomAlert()
  const [selected_msg_for_focus_mode, setSelected_msg_for_focus_mode] = useState<any>(null)
  const [input, setinput] = useState<any>('')
  const [logged_user, setLoggedUser] = useState<string | null>(JSON.parse(storage.getString('user')).user.id)
  const [audio_call_modal, setAudio_call_modal] = useState<boolean | null>(false)
  const { chat_id, chat_type, avatar, name, recipient_id, sender_data } = useLocalSearchParams()
  const [messages, setMessages] = useState<any[]>(context.messages || [])
  const flatListRef = useRef(null);
  const [messageOptions, setMessageOptions] = useState<boolean>(false)
  const [pickMedia, setPickMedia] = useState<boolean>(false)
  
  const walls = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9JohhdOwVkWIenjINcSm62489tnbGS21EuKSW7nNd8g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ_wXo5gRE7vn6iAFHcPRbmRsVL9V0U-9ZMXcFolP10Q&s=10',
    'https://wallpapers.com/images/hd/minimalist-planetary-design-yo4xhchp4govyrdq.jpg'
  ]
  
  /*const senderSizeValue = useSharedValue(0)
  const scaleButtonValue = useSharedValue(0)
  
  const senderButtonStyle = useAnimatedStyle(() => ({
    height: senderSizeValue.value,
    width: senderSizeValue.value,
    transform: [{ scale: scaleButtonValue.value }],
  }))
  
  useEffect(() => {
    if (input) {
      senderSizeValue.value = withTiming(45, { duration: 100 })
      return scaleButtonValue.value = withTiming(1, { duration: 250 })
    }
    senderSizeValue.value = withTiming(0, { duration: 250 })
    scaleButtonValue.value = withTiming(0, { duration: 250 })
  }, [input])*/
  
  function isTheLastMessageMine(messages: any, currentMassage: any) {
    const verif = messages[0]
    return verif.sender_id === logged_user && currentMassage.id === verif.id
  }
  
  useEffect(() => {
    (async () => {
      //return await context.load_messages(chat_id)
      if(chat_id){
        const messages = await getMessages({chat_id})
        if(messages.length){
          setMessages(messages)
        }
      }
      setIsReady(true)
    })()
  }, [])
  
  useEffect(() => {
    AppEvent.on(Events.MSG_SEND, (msg) => {
      if(msg.chat_id !== chat_id) return
      if(msg.sender_id === logged_user) return
      setMessages((prev) => [msg, ...prev])
      socket.emit('message:seen', { msg_id: msg.id, at: Date.now(), toUser: recipient_id, status: 'Seen' })
    })
    
    /*socket.on('message:status', async (data) => {
      await MessageStatus(data.msg_id, data.status, data.at)
    })*/
  }, [])
  
  const clearMsgs = () => setMessages([])
  
  useEffect(() => {
    const buttonHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      clearMsgs()
    })
    return () => buttonHandler.remove()
  }, [])
  
  const send = async (params = { input: null }) => {
    try {
      const saveMsg = await localMsgStore({
        chat_id,
        sender_id: logged_user,
        content : params?.input?.trim() || input?.trim(),
        type: 'text',
        content_url : null,
        attachments: [],
        reply_to : null,
        disappears_at : null,
        to: recipient_id
      })
      const sender = sender_data && JSON.parse(sender_data)
      setMessages((prev) => [saveMsg, ...prev])
      if(socket?.id && saveMsg?.id){
        await sendMessage({...saveMsg, toUser: recipient_id}, sender)
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  if (!isReady || !chat_id) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
      }}>
        <ActivityIndicator color='#6a69fe'/>
      </View>
    )
  }
  
  return ( !isReady? null :
    <ImageBackground source={{uri: walls[1]}} resizeMode='cover' style={{
      ...styles.container,
    }}>
      <Stack.Screen
        options={{
          headerShown: true
        }}
      />
      {pickMedia? <UseMediaPicker onClose={() => setPickMedia(false)}/> : null}
      {selected_msg_for_focus_mode &&
        <MsgFocus 
          msg={selected_msg_for_focus_mode}
          user={logged_user}
          actionTaken={ async (value) => {
            if (value == 'delete') {
              alert('Delete for', (
                <View style={{
                  padding: 0,
                }}>
                  <TouchableOpacity onPress={ async () => {
                    setMessages((prev) => prev.filter(msg => msg.id !== selected_msg_for_focus_mode.id))
                    await deleteMessage(selected_msg_for_focus_mode.id)
                  }}>
                    <Text style={{
                      color: '#6a69fe',
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>For me</Text> 
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={ async () => {
                    setMessages((prev) => prev.filter(msg => msg.id !== selected_msg_for_focus_mode.id))
                    await deleteMessage(selected_msg_for_focus_mode.id)
                  }}>
                    <Text style={{
                      color: '#6a69fe',
                      fontWeight: 'bold',
                      marginTop: 30,
                    }}>For everyone</Text> 
                  </TouchableOpacity>
                  <View></View> 
                </View> 
              ), [{ text: 'Cancel'}])
            }
            if (value?.type == 'reaction') {
              return null
            }
            setSelected_msg_for_focus_mode(null)
          }}
          onClose={() => setSelected_msg_for_focus_mode(null)}
        />
      }
      {messageOptions &&
        <MessagesOptions
          onClose={(value) => {
            if (value == 'media_pick') {
              setPickMedia(true)
            }
            if (value == 'reaction') {
              return null
            }
            setMessageOptions(false)
          }}
        />
      }
      <Header headerLeft={
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
          <TouchableOpacity onPress={() => { 
            router.back()
            clearMsgs()
          }}>
            <ArrowLeft color='white'/>
          </TouchableOpacity>
          <Image
            src={avatar}
            style={{
              height: 33,
              width: 33,
            }}
          />
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <Text style={{
              color: 'white',
              fontWeight: 'bold',
            }}>{name}</Text>
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
          gap: 30
        }}>
          <TouchableOpacity style={{
            opacity: messages.length < 2 && .4,
          }} key={1} onPress={() => {
            if(messages.length < 2) return
            handleViber.Strong()
            alert(null, 'Are you sure you want to make the call?', [
              {
                text: 'Cancel'
              },
              {
                text: 'Call',
                primary: true,
                onPress: () => {
                  setAudio_call_modal(true)
                  handleViber.Strong()
                }
              },
            ])
          }}>
            <HugeiconsIcon color='white' icon={CallAdd02Icon}/>
          </TouchableOpacity>
          <TouchableOpacity style={{
            opacity: messages.length < 2 && .4,
          }} onPress={() => {
            if(messages.length < 2) return
            router.push({
              pathname: '/pages/chat/settings',
              params: {
                name,
                avatar
              }
            })
          }} key={2}>
            <HugeiconsIcon icon={SettingsIcon} color='white'/>
          </TouchableOpacity>
        </View>
      }
      headerRightStyle={{
        padding: 0,
      }}
      />
      {audio_call_modal? <Audio 
        chat={{
          avatar,
          name,
          chat_id,
          wall: walls[2]
        }}
        onClose={() => setAudio_call_modal(false)}
      /> : null}
      {/*<Text className='text-white'>Chat</Text>*/}
      <FlatList 
        data={messages}
        //ListFooterComponent={<Info id={recipient_id}/>}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        inverted
        keyExtractor={(item) => item.id}
        style={{
          flex: 1,
        }}
        ref={flatListRef}
        renderItem={({ item, index }) => (
          <Message 
            logged_user={logged_user} 
            item={item}
            isMyLastMessage={isTheLastMessageMine(messages, item)}
            shouldShow={shouldShowAvatar(item, messages[index - 1])}
            room_icon={avatar}
            isLast={item.id === messages[0].id}
            onLongPress={() => {
              setSelected_msg_for_focus_mode(item)
            }}
          />
        )}
      />
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        //placeItems: 'end',
        marginTop: 5,
        marginBottom:  insets.bottom? (insets.bottom + 10) : 5 || 5,
        gap: input && 7,
        paddingHorizontal: 5,
        //paddingVertical: 5,
        //borderWidth: 1,
        //borderColor: 'white',
        //backgroundColor: '#121212',
        //borderTopWidth: 1,
        //borderColor: '#1d1d1d',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderRadius: 25,
      }}>
        <View style={{
          flex: 1,
          //borderRadius: 25,
          minHeight: 45,
          backgroundColor: '#131313',
          paddingVertical: 5,
          paddingHorizontal: 5,
          //paddingLeft: 5,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 7,
          //width: '83%',
          borderRadius: 30,
          //borderWidth: 1,
          borderColor: '#171717'
        }}>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            //display: input && 'none',
            gap: 7,
            
          }}>
            
           <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 50,
                backgroundColor: '#1d1d1d' || '#343484',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: messages.length < 2 && .4,
              }}
              onPress={ async () => {
                messages.length >= 2 && await handleViber.Strong()
                messages.length >= 2 && setMessageOptions(true)
              }}>
              <HugeiconsIcon 
                icon={AddIcon} 
                color='white'
                size={25}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1d1d1d',
                display: input && 'none',
                opacity: messages.length < 2 && .4,
              }}
              onPress={ async () => {
                messages.length >= 2 && await handleViber.Strong()
              }}>
              <HugeiconsIcon 
                icon={CameraIcon} 
                color='white'
              />
            </TouchableOpacity>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            flex: 1,
            borderRadius: 20,
            minHeight: 35,
            padding: 3,
            backgroundColor: '#1d1d1d',
          }}>
            <TextInput 
              cursorColor='#6a69fe' 
              maxHeight={90} 
              value={input} 
              onChangeText={(val) => setinput(val)} 
              placeholderTextColor='darkgray' 
              multiline 
              selectionColor="#6a69fe"
              placeholder='Message here...' 
              style={{
                flex: 1,
                color: 'white',
                minHeight: 33.5,
                borderWidth: 0,
                borderColor: 'white',
                padding: 0,
                marginLeft: 5,
                fontSize: 15,
                paddingHorizontal: 10
              }}
            />
            <TouchableOpacity
              style={{
                height: 33.5,
                width: 33.5,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                //backgroundColor: '#1d1d1d',
              }}
              onPress={ async () => {
                await handleViber.Strong()
              }}>
              <HugeiconsIcon 
                icon={SmileIcon} 
                color='white'
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: input? '#6a69fe' : '#1d1d1d',
              paddingTop: input? 2.5 : undefined,
              paddingRight: input? 2.5 : undefined,
            }}
            onPress={ async () => {
              input && await handleViber.Light()
              input && setinput('')
              input && send()
            }}>
            {input? 
              <HugeiconsIcon 
                icon={SentIcon} 
                fill={'white'}
                color={'#6a69fe'}
              /> : 
              <AudioLines 
                color='white'
              /> 
            }
          </TouchableOpacity>
        </View>
      </View>
      
      <Animated.View 
        style={[{ height: height }]}>
      </Animated.View>
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