import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
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
  ]
  
  const options = [
    {
      label: 'Reply',
      icon: <HugeiconsIcon icon={LinkBackwardIcon} color={'white'} size={22}   />,
      type: 'lucide'
    },
    {
      label: 'Edit',
      icon: <HugeiconsIcon icon={PenIcon} color={'white'} size={22}   />,
      display: msg.sender_id === user || false,
      type: 'huge'
    },
    {
      label: 'Copy',
      icon: <HugeiconsIcon icon={CopyIcon} color={'white'} size={22}   />,
      type: 'huge'
    },
    {
      label: 'Forward',
      icon: <HugeiconsIcon icon={LinkForwardIcon} color={'white'} size={22}   />,
      type: 'huge'
    },
    {
      label: 'Pin',
      icon: <HugeiconsIcon icon={PinIcon} color={'white'} size={22}   />,
      type: 'huge'
    },
    {
      label: 'Delete',
      icon: <HugeiconsIcon icon={Delete02Icon} color={'tomato'}/>,
      display: msg.sender_id === user || false,
      danger: true,
      action: () => actionTaken('delete'),
      type: 'huge'
    },
  ]
  
  const bottomLineOptions = [
    {
      label: 'Info',
      icon: <HugeiconsIcon icon={InformationCircleIcon} color={'white'} size={22}   />,
      type: 'huge'
    },
    {
      label: 'Report',
      icon: <HugeiconsIcon icon={AlertIcon} color={'white'} size={22}   />,
      type: 'lucide'
    },
  ]
  
  const reactionDiv = {
    width: '90%',
    height: 50,
    borderRadius: 9999,
    backgroundColor: '#161616',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 8,
    marginHorizontal: 16,
    justifyContent: 'space-evenly',
    alignSelf: msg.sender_id === user? 'flex-end' : 'flex-start',
  }
  
  const actionsDiv = {
    width: '52%',
    //maxWidth: 200,
    backgroundColor: '#151515',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingBottom: 0,
    marginHorizontal: 16,
    overflow: 'hidden',
    //height: 100,
    alignSelf: msg.sender_id === user? 'flex-end' : 'flex-start',
  }
  
  return (
    <Modal onRequestClose={onClose} transparent animationType='fade'>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
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
            <Text className='' style={
              msg.sender_id === user? styles.msgRight.msgTextRight : styles.msgLeft.msgTextLeft
            }>{msg.content}</Text>
          </Animated.View>
          <Animated.View style={[actionsDiv, animatedStyle]} onPress={(e) => e?.stopPropagation()}>
          {options.map(({label, icon, danger, type, action}, i) => (
            <TouchableOpacity
              key={i}
              onPress={action || onClose}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                height: 45.5,
                //backgroundColor: 'pink',
              }}
            >
              <Text style={{
                fontSize: 16,
                color: danger? 'tomato' : 'white'
              }}>
                {label}
              </Text>
              {icon}
            </TouchableOpacity>
          ))}
          <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderColor: '#1d1d1d',
            height: 40,
            //backgroundColor: 'white',
            overflow: 'hidden',
            //paddingVertical: 7,
            marginTop: 5
          }}>
            {bottomLineOptions.map(({display, label, action, danger, icon}, i) => (
              <TouchableOpacity key={i} style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                //backgroundColor: 'white',
                //paddingVertical: 7,
                flex: 1,
                height: '100%',
                borderLeftWidth: i == 1? 1 : 0,
                //borderRightWidth: i == 1? 1 : 0,
                borderLeftColor: i == 1? '#262626' : null,
                //borderRightColor: i == 1? '#262626' : null,
              }} onPress={action || onClose}>
                {icon}
                <Text style={{
                  color: danger? 'tomato' : 'white',
                  fontSize: 12,
                  display: 'none',
                }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
      paddingVertical: 8,
      paddingHorizontal: 12,
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
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#6a69fe',
      borderRadius: 20,
      //borderBottomRightRadius: 5,
      textAlign: 'start',
      whiteSpace: 'pre-line',
      color: 'white',
    }
  },
  
});

export default MsgFocus;