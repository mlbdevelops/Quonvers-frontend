import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Plus, Forward, Share, Copy, AlertTriangle, Trash2, Pen, MessageCircleReply, Type } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { AddIcon, CopyIcon, EditIcon, LinkForwardIcon, Delete02Icon, PenIcon, AlertIcon, LinkBackwardIcon, PinIcon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import GlassView from "../glassView.tsx"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import haptics from '../../hooks/haptics.js'
const MsgFocus = ({msg, user, onClose, actionTaken}) => {
  const scale = useSharedValue(0.8)
  const { handleViber } = haptics()
  
  useEffect(() => {
    handleViber.Strong()
    scale.value = withTiming(1, { duration: 120 })
  }, [])
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))
  
  const reactions = [
    '🔥',
    '❤️',
    '👀',
    '😂',
    '😭',
    '👎',
    '☠️'
  ]
  
  const options = [
    {
      label: 'Reply',
      icon: <HugeiconsIcon icon={LinkBackwardIcon} color={'white'} size={20}   />,
      type: 'lucide'
    },
    {
      label: 'Edit',
      icon: <HugeiconsIcon icon={PenIcon} color={'white'} size={20}   />,
      display: msg.sender_id === user || false,
      type: 'huge'
    },
    {
      label: 'Copy',
      icon: <HugeiconsIcon icon={CopyIcon} color={'white'} size={20}   />,
      type: 'huge'
    },
    {
      label: 'Forward',
      icon: <HugeiconsIcon icon={LinkForwardIcon} color={'white'} size={20}   />,
      type: 'huge'
    },
    {
      label: 'Pin',
      icon: <HugeiconsIcon icon={PinIcon} color={'white'} size={20}   />,
      type: 'huge'
    },
    {
      label: 'Delete',
      icon: <HugeiconsIcon icon={Delete02Icon} color={'tomato'} size={20}/>,
      display: msg.sender_id === user || false,
      danger: true,
      action: () => actionTaken('delete'),
      type: 'huge'
    },
    /*{
      label: 'Info',
      icon: <HugeiconsIcon icon={InformationCircleIcon} color={'white'} size={20}   />,
      type: 'huge'
    },
    {
      label: 'Report',
      icon: <HugeiconsIcon icon={AlertIcon} color={'white'} size={20}   />,
      type: 'lucide'
    },*/
  ]
  
  const reactionDiv = {
    width: '95%',
    height: 50,
    borderRadius: 9999,
    backgroundColor: '#161616',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 8,
    marginHorizontal: 16,
    justifyContent: 'space-evenly',
  }
  
  const actionsDiv = {
    width: 190,
    //maxWidth: 200,
    backgroundColor: '#151515',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    //paddingVertical: 15,
    marginHorizontal: 15,
    overflow: 'hidden',
    //height: 100,
    padding: 10,
    marginBottom: 15,
    alignSelf: msg.sender_id === user? 'flex-end' : 'flex-start',
  }
  
  return (
    <Modal onRequestClose={onClose} transparent animationType='fade'>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}>
          <Animated.View
            style={[reactionDiv, animatedStyle]}
          >
            {reactions.map((obj, i) => (
              <TouchableOpacity key={i} onPress={() => actionTaken({type: 'reaction', value: obj})}>
                <Text
                  style={{
                    fontSize: 25,
                  }}
                >
                  {obj}
                </Text>
              </TouchableOpacity>
            ))}
            <HugeiconsIcon
              icon={AddIcon}
              size={33}
              color='darkgray'
              style={{
                padding: 4,
                height: 10,
                borderRadius: 999999,
                width: 10,
                backgroundColor: '#1f1f1f',
              }}
            />
          </Animated.View>
          <Animated.View style={[
            msg.sender_id === user? styles.msgRight : styles.msgLeft,
            animatedStyle
          ]}>
            <Text style={{
              fontSize: 15,
              ...msg.sender_id === user? styles.msgRight.msgTextRight : styles.msgLeft.msgTextLeft
            }}>{msg.content}</Text>
          </Animated.View>
          <Animated.View style={[actionsDiv, animatedStyle]}>
          {options.map(({label, icon, danger, type, action}, i) => (
            <TouchableHighlight
              key={i}
              underlayColor='black'
              onPress={action || onClose}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                //justifyContent: 'space-between',
                paddingHorizontal: 4,
                height: 45.5,
                borderRadius: 100,
                //backgroundColor: 'pink',
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}>
                <View style={{
                  height: 37,
                  width: 37,
                  borderRadius: 100,
                  backgroundColor: danger? '#ff63471d' : '#1d1d1d',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 0,
                }}>
                  {icon}
                </View>
                <Text style={{
                  fontSize: 16,
                  color: danger? 'tomato' : 'white'
                }}>
                  {label}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  msgLeft: {
    minWidth: 50,
    alignSelf: 'flex-start',
    maxWidth: 250,
    textAlign: 'start',
    marginHorizontal: 16,
    marginVertical: 10,
    fontSize: 14.5,
    wordBreak: 'break-word',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
   
    msgTextLeft: {
      backgroundColor: '#262626',
      borderRadius: 20,
      //borderBottomLeftRadius: 5,
      paddingVertical: 9,
      paddingHorizontal: 14,
      whiteSpace: 'pre-line',
      color: 'white',
    }
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc0cb58',
  },
  
  msgRight : {
    minWidth: 50,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: 250,
    marginHorizontal: 16,
    marginVertical: 10,
    wordBreak: 'line-break',
    fontSize: 14.5,
   
    msgTextRight : {
      paddingVertical: 9,
      paddingHorizontal: 14,
      backgroundColor: '#5E4BFA' || '#6a69fe',
      //borderBottomRightRadius: 5,
      borderRadius: 20,
      textAlign: 'start',
      whiteSpace: 'pre-line',
      color: 'white',
    }
  },
  
});

export default MsgFocus;