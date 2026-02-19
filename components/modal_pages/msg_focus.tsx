import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Plus, Forward, Share, Copy, AlertTriangle, Trash2, Pen, MessageCircleReply, Type } from 'lucide-react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { AddIcon, CopyIcon, EditIcon, LinkForwardIcon, Delete02Icon, PenIcon, AlertIcon, LinkBackward } from '@hugeicons/core-free-icons';
import GlassView from "../glassView.tsx"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import haptics from '../../hooks/haptics.js'
const MsgFocus = ({msg, user, onClose, actionTaken}) => {
  const scale = useSharedValue(0.9)
  const { handleViber } = haptics()
  
  useEffect(() => {
    handleViber.Light()
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
      icon: <MessageCircleReply size={20} color={'white'}/>,
      type: 'lucide'
    },
    {
      label: 'Forward',
      icon: <HugeiconsIcon icon={LinkForwardIcon} size={20} color={'white'}/>,
      type: 'huge'
    },
    {
      label: 'Edit',
      icon: <HugeiconsIcon icon={PenIcon} size={20} color={'white'}/>,
      display: msg.sender_id === user || false,
      type: 'huge'
    },
    {
      label: 'Copy',
      icon: <HugeiconsIcon icon={CopyIcon} size={20} color={'white'}/>,
      type: 'huge'
    },
    {
      label: 'Report',
      icon: <HugeiconsIcon icon={AlertIcon} size={20} color={'white'}/>,
      type: 'lucide'
    },
    {
      label: 'Delete',
      icon: <HugeiconsIcon icon={Delete02Icon} size={20} color={'tomato'}/>,
      display: msg.sender_id === user || false,
      danger: true,
      action: () => actionTaken('delete'),
      type: 'huge'
    },
  ]
  
  const reactionDiv = {
    width: '85%',
    height: 50,
    borderRadius: 9999,
    backgroundColor: '#161616',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 4,
    marginHorizontal: 16,
    justifyContent: 'space-evenly',
    alignSelf: msg.sender_id === user? 'flex-end' : 'flex-start',
  }
  
  const actionsDiv = {
    width: '45%',
    backgroundColor: '#151515',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    //height: 100,
    alignSelf: msg.sender_id === user? 'flex-end' : 'flex-start',
  }
  
  return (
    <Modal transparent animationType='fade'>
      <TouchableWithoutFeedback onPress={onClose}>
        <GlassView viewStyle={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
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
                paddingHorizontal: 16,
                height: 40,
                //backgroundColor: 'pink',
              }}
            >
              <Text style={{
                color: danger? 'tomato' : 'white'
              }}>
                {label}
              </Text>
              {icon}
            </TouchableOpacity>
          ))}
        </Animated.View>
        </GlassView>
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
      backgroundColor: '#2c1e55',
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