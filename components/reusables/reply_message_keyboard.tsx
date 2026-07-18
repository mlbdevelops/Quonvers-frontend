import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

const ReplyMessageKeyboard = ({msg, closeClick, reply_to}) => {
  const heightValue = useSharedValue(0)
  
  const componentStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }))
  
  const heightValueChange = (toValue = 0) => {
    heightValue.value = withTiming(toValue, { duration: 200})
  }
  
  useEffect(() => {
    heightValueChange(50)
  }, [])
  
  return (
    <Animated.View style={[{
      gap: 8,
      width: '100%',
      padding: 11,
      paddingBottom: 5,
      alignItems: 'center',
      //height: 50,
      flexDirection: 'row',
      overflow: 'hidden',
    }, componentStyle]}>
      <View style={{
        height: '100%',
        width: 2.5,
        borderRadius: 50,
        backgroundColor: '#707070',
      }}/>
      <View style={{
        flex: 1,
        borderRadius: 20,
        gap: 3
      }}>
        <Text numberOfLines={1} style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 12,
        }}>{reply_to}</Text>
        <Text numberOfLines={1} style={{
          color: 'white',
        }}>{msg?.content}</Text>
      </View>
      <TouchableOpacity onPress={closeClick} style={{
        height: 28,
        width: 28,
        borderRadius: 50,
        backgroundColor: '#1f1f1f',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#262626',
        borderWidth: 1,
      }}>
        <X size={17} color='white'/>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ReplyMessageKeyboard;