import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import KeyboardAvareView from '../reusables/keyboardAvareView.tsx'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SentIcon } from '@hugeicons/core-free-icons';
import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import haptics from '@/hooks/haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Message from '@/components/reusables/message'

const EditMessage = ({msg, bubble_color, onClose, send, logged_user, returnData}) => {
  const insets = useSafeAreaInsets()
  const [input, setinput] = useState(msg.content)
  const { handleViber } = haptics()
  
  return (
    <Modal transparent onRequestClose={onClose} animationType='fade'>
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          flexDirection: 'column',
          width: '100%',
          paddingBottom: 10,
        }}>
          <Message
            logged_user={logged_user} 
            item={msg}
            bubble_color={bubble_color || '#5E4BFA'}
          />
        </View>
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
                autoFocus
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
            </View>
            
            <TouchableOpacity
              activeOpacity={.5}
              style={{
                height: 40,
                width: 40,
                borderRadius: 50,
                alignItems: 'center',
                opacity: input?.trim() && input?.trim() !== msg.content? 1 : .5,
                justifyContent: 'center',
                backgroundColor: bubble_color || '#6a69fe',
                paddingTop: 2.5,
                paddingRight: 2.5,
              }}
              onPress={ async () => {
                input?.trim() && input?.trim() !== msg.content && await handleViber.Light()
                input?.trim() && input?.trim() !== msg.content && setinput('')
                input?.trim() && input?.trim() !== msg.content && returnData({newContent: input?.trim(), message_id: msg?.id})
              }}>
              <HugeiconsIcon 
                icon={SentIcon} 
                fill={'white'}
                color={`${bubble_color}80`}
              /> 
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <KeyboardAvareView/>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditMessage;