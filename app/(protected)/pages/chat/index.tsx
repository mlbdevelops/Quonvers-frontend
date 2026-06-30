//import UseMediaPicker from '../../../quonvers_mob/frontend/hooks/UseMediaPicker';
import Image from '@/components/reusables/Image';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Pressable, Keyboard, FlatList, TouchableWithoutFeedback, ScrollView, Alert, ImageBackground, ActivityIndicator, BackHandler, ViewToken } from 'react-native';
import Header from '@/components/header'
import { ArrowLeft, Phone, PlusCircle, Smile, AudioLines, SendHorizontal, ArrowUp, CheckCheck } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image02Icon, MicIcon, SettingsIcon, VideoIcon, ImagesIcon, CallAdd02Icon, AudioWave01Icon, Mic02Icon, AddCircleIcon, SmileIcon, SentIcon, Check01Icon, CameraIcon, AddIcon, Unlink04Icon, Clock01Icon, TimeHalfPassIcon } from '@hugeicons/core-free-icons';
import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import haptics from '@/hooks/haptics'
import trans from '@/hooks/fetch'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stack } from 'expo-router';
import { useKeyboard } from '@/hooks/keyboard';
import Message from '@/components/reusables/message'
import Button from '@/components/reusables/button'
import MsgFocus from '@/components/modal_pages/msg_focus'
import EditMessage from '@/components/modal_pages/edit_message'
import MessagesOptions from '@/components/modal_pages/chat_send_messages_options'
import { useAnimatedKeyboard } from "react-native-keyboard-controller";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { localMsgStore, deleteMessage, sendMessage, SendMessageUpdate } from '@/utils/MessageServices/index'
import { storage } from '@/storage/mmkv'
import shouldShowAvatar from '@/utils/logics/is_same_sender'
import { socket } from '@/hooks/sockets/socket_provider'
import { getMessages } from '@/utils/MessageServices/GetMesages'
import { ChatContext } from '@/contexts/chatContext'
import { useCustomAlert } from '@/hooks/alert'
import { useOptionList } from '@/hooks/optionList'
import { UseMediaPicker } from '@/hooks/useMediaPicker'
import { FlashList } from '@shopify/flash-list'
import AppEvent, { Events } from '@/utils/eventEmitter';
import { MessageStatus, ProcessRecipientMessages } from '@/utils/MessageServices'
import Info from '@/components/chat/info'
import { backgroundImage } from '@/utils/backgrounds'
import { useNavigation } from '@react-navigation/native';
import { getDb } from '@/storage/db'

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
  const { chat_id, chat_type, avatar, name: initialName, recipient_id, sender_data, msg_vanish_millis, bubble_color: loggedUserInitialBubbleColor, bg_uri: initialBgUri, brightness: initialBrightness } = useLocalSearchParams()
  const [bubble_color, setBubble_color] = useState(loggedUserInitialBubbleColor)
  const [bg_uri, setBg_uri] = useState(initialBgUri)
  const [brightness, setBrightness] = useState(Number(initialBrightness))
  const [name, setName] = useState(initialName)
  const [messages, setMessages] = useState<any[]>(context.messages || [])
  const flatListRef = useRef(null);
  const [messageOptions, setMessageOptions] = useState<boolean>(false)
  const [vanish_enabled, setVanish_enabled] = useState(msg_vanish_millis || 0)
  const [pickMedia, setPickMedia] = useState<boolean>(false)
  const navigation = useNavigation();
  const optionList = useOptionList()
  const [isMsgEditing, setIsMsgEditing] = useState(false)
  const [messageFocusMode, setMessageFocusMode] = useState(false)
  
  useEffect(() => {
    navigation.addListener('focus', () => {
      context.setActiveChatRoomId(chat_id);
    });
    
    const unsubscribeBlur = navigation.addListener('blur', () => {
      context.setActiveChatRoomId(null);
      console.log('Chat_id removed in Active room')
    });
    return () => unsubscribeBlur();
  }, [navigation, chat_id]);
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
    minimumViewTime: 500,
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const unseenRecipientMsgs = viewableItems
      .map(item => item.item)
      .filter(msg => msg && msg.sender_id !== logged_user && msg.status !== 'Seen');
    for (let msg of unseenRecipientMsgs) {
      ProcessRecipientMessages(msg, 
        (backData) => {
          setMessages((prevMessages) => {
            const index = prevMessages.findIndex(m => m.id === backData.id);
            if (index === -1) return prevMessages;
            const updatedMessages = [...prevMessages];
            updatedMessages[index] = {
              ...updatedMessages[index],
              status: backData?.status
            };
            return updatedMessages;
          });
        }
      );
    }
  }, [logged_user]);

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);
  
  function isTheLastMessageMine(messages: any, currentMassage: any) {
    const verif = messages[0]
    return verif.sender_id === logged_user && currentMassage.id === verif.id
  }
  
  useEffect(() => {
    (async () => {
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
    AppEvent.on(Events.MSG_SEND, async (msg) => {
      if(msg?.disable_ui_update) return
      if(msg.chat_id !== chat_id) return
      if(msg.sender_id === logged_user) return
      setMessages((prev) => [msg, ...prev])
    })
    
    AppEvent.on(Events.NICKNAME_CHANGE, (e) => {
      if(e.chat_id === chat_id) setName(e.newName)
    })
    
    AppEvent.on(Events.MSG_VANISH, (e) => {
      if(e.chat_id !== chat_id) return
      setVanish_enabled(e.duration)
    })
    
    AppEvent.on(Events.UPDATE_MESSAGE, (data) => {
      if(data.chat_id !== chat_id) return
      if(!data.message_id) return
      setMessages((prev) => {
        const getIndex = prev.findIndex(m => m.id === data.message_id)
        if(getIndex === -1) return prev
        const updateMessages = [...prev]
        updateMessages[getIndex] = {
          ...updateMessages[getIndex],
          edited: data.edited,
          deleted: data.deleted,
          content: data.content
        }
        return updateMessages
      })
    })
    
    AppEvent.on(Events.MSG_STATUS_UPDATE, (data) => {
      if(!data.msg_id) return
      setMessages((prev) => {
        const getIndex = prev.findIndex(m => m.id === data.msg_id)
        if(getIndex === -1) return prev
        const updateMessages = [...prev]
        updateMessages[getIndex] = {
          ...updateMessages[getIndex],
          status: data.status
        }
        return updateMessages
      })
    })
    
    AppEvent.on(Events.CHAT_THEME_CHANGE, (data) => {
      if(chat_id !== data.chat_id) return
      if(data.bubble_color) setBubble_color(data.bubble_color)
      if(data.bg_uri) setBg_uri(data.bg_uri)
      if(data.brightness) setBrightness(Number(data.brightness))
    })
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
        disappearing_millisecs: msg_vanish_millis,
        to: recipient_id
      }, chat_id)
      if(!saveMsg?.content.trim()) return
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
  
  const deleteForMe = async () => {
    try {
      const findMessageIndex = messages?.findIndex(m => m.id == selected_msg_for_focus_mode.id)
      const isLast = selected_msg_for_focus_mode === messages[0]
      console.log(isLast)
      const updateLastChatTo = isLast ? messages[findMessageIndex + 1] : null
      console.log(updateLastChatTo)
      await deleteMessage(selected_msg_for_focus_mode?.id, chat_id, updateLastChatTo)
    } catch (error) {
      console.error(error);
    }finally{
      setMessages((prev) => prev.filter(msg => msg.id !== selected_msg_for_focus_mode.id))
      setSelected_msg_for_focus_mode(null)
    }
  }
  
  const MessageUpdate = async (command) => {
    const updateObj = {
      sender_id: logged_user,
      toUser: recipient_id,
      command: command.type,
      content: command?.type === 'delete'? null : command?.newContent,
      message_id: selected_msg_for_focus_mode?.id
    }
    if(!updateObj.message_id || !updateObj.sender_id || !updateObj.toUser) return
    const db = await getDb()
    try {
      await SendMessageUpdate(updateObj)
    } catch (error) {
      console.error(error);
    }finally{
      if(command.type == 'delete' && selected_msg_for_focus_mode?.deleted){
        try {
          await deleteForMe()
        } catch (error) {
          console.error(error);
        }finally{
          setMessages((prev) => prev.findIndex(m => m.id === selected_msg_for_focus_mode?.id))
        }
        return
      }
      if(command.type == 'delete') await db.runAsync('UPDATE messages SET deleted = ?, content = ?, status = ? WHERE id = ?', [command?.type === 'delete', command?.newContent, command.type == 'delete' && 'Deleted', selected_msg_for_focus_mode?.id])
      if(command.type == 'edit') await db.runAsync('UPDATE messages SET edited = ?, content = ? WHERE id = ?', [command?.type === 'edit', command.newContent, selected_msg_for_focus_mode?.id])
      setMessages((prev) => {
        const getIndex = prev.findIndex(m => m.id === updateObj.message_id)
        if(getIndex === -1) return prev
        const updateMessages = [...prev]
        updateMessages[getIndex] = {
          ...updateMessages[getIndex],
          edited: command.type == 'edit',
          deleted: command.type == 'delete',
          content: command.newContent,
          ...command.type == 'delete' && { status: 'Deleted' }
        }
        const emitObject = {
          msg_id: selected_msg_for_focus_mode.id,
          status: command.type == 'delete' && 'Deleted', 
          //at: command.type == 'delete' && Date.now(),
          isEdit: command.type == 'edit'
        }
        AppEvent.emit(Events.MSG_STATUS_UPDATE, emitObject)
        AppEvent.emit(Events.MSG_SEND, {...updateMessages[getIndex], disable_ui_update: true})
        return updateMessages
      })
      setSelected_msg_for_focus_mode(null)
    }
  }
  
  return ( !isReady? null :
    <ImageBackground imageStyle={{
      opacity: brightness
    }} source={backgroundImage(bg_uri)} resizeMode='cover' style={{
        ...styles.container,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true
        }}
      />
      {pickMedia && <UseMediaPicker 
        onClose={() => setPickMedia(false)}
        onPick={() => setPickMedia(false)}
      />}
      {isMsgEditing && selected_msg_for_focus_mode && <EditMessage 
        onClose={() => setIsMsgEditing(false)}
        msg={selected_msg_for_focus_mode}
        bubble_color={bubble_color}
        logged_user={logged_user}
        returnData={
          ({newContent, message_id}) => {
            MessageUpdate({type: 'edit', newContent, message_id })
          }
        }
      />}
      {selected_msg_for_focus_mode && messageFocusMode &&
        <MsgFocus 
          msg={selected_msg_for_focus_mode}
          user={logged_user}
          showOnlyLabel={selected_msg_for_focus_mode.deleted? ['Delete'] : undefined }
          showReactions={selected_msg_for_focus_mode.deleted? false : undefined }
          bubble_color={bubble_color}
          actionTaken={ async (value) => {
            setMessageFocusMode(false)
            if(value == 'copy') setSelected_msg_for_focus_mode(null)
            if (value == 'delete') {
              alert(null, 'Delete message', [
                { text: 'For me', primary: true, bold: true, onPress: () => deleteForMe()},
                { text: 'For everyone', primary: true, bold: true, display: selected_msg_for_focus_mode?.sender_id == logged_user && selected_msg_for_focus_mode?.deleted != true && selected_msg_for_focus_mode?.status != 'Sending', onPress: () => MessageUpdate({type: 'delete', newContent: null})},
                { text: 'Cancel', onPress: () => setSelected_msg_for_focus_mode(null)}
              ])
            }
            if (value == 'edit') {
              setIsMsgEditing(true)
              setMessageFocusMode(false)
            }
          }}
          onClose={() => {
            setMessageFocusMode(false)
            setSelected_msg_for_focus_mode(null)
          }}
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
            <View style={{
              alignItems: 'center',
              gap: 5,
              flexDirection:'row'
            }}>
              <Text style={{
                fontSize: 10,
                color: 'darkgray',
              }}>Online • 8:19AM</Text>
              {vanish_enabled > 0? <HugeiconsIcon icon={TimeHalfPassIcon} color='darkgray' size={10} strokeWidth={2}/> : null}
            </View>
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
                  router.push({
                    pathname: '/pages/chat/call/audio_call',
                    params: {
                      chat_name: name,
                      avatar,
                      chat_id
                    }
                  })
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
                avatar,
                id: recipient_id,
                chat_id
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
        removeClippedSubviews={true}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item, index }) => (
          <Message 
            logged_user={logged_user} 
            item={item}
            isMyLastMessage={isTheLastMessageMine(messages, item)}
            shouldShow={shouldShowAvatar(item, messages[index - 1])}
            room_icon={avatar}
            bubble_color={bubble_color || '#5E4BFA'}
            isLast={item.id === messages[0].id}
            onLongPress={() => {
              setSelected_msg_for_focus_mode(item)
              setMessageFocusMode(true)
            }}
          />
        )}
      />
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom:  insets.bottom? (insets.bottom + 10) : 5 || 5,
        gap: input && 7,
        paddingHorizontal: 5,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderRadius: 25,
      }}>
        <View style={{
          flex: 1,
          minHeight: 45,
          backgroundColor: '#131313',
          paddingVertical: 5,
          paddingHorizontal: 5,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 7,
          borderRadius: 30,
          borderColor: '#171717'
        }}>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
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
              cursorColor={bubble_color ?? '#6a69fe' }
              maxHeight={90} 
              value={input} 
              onChangeText={(val) => setinput(val)}
              placeholderTextColor='darkgray' 
              multiline 
              selectionColor={bubble_color ?? '#6a69fe' }
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
              backgroundColor: input.trim()? (bubble_color || '#6a69fe') : '#1d1d1d',
              paddingTop: input.trim()? 2.5 : undefined,
              paddingRight: input.trim()? 2.5 : undefined,
            }}
            onPress={ async () => {
              input.trim() && await handleViber.Light()
              input.trim() && setinput('')
              input.trim() && send()
            }}>
            {input.trim()? 
              <HugeiconsIcon 
                icon={SentIcon} 
                fill={'white'}
                color={bubble_color ?? '#6a69fe'}
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