import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import haptics from '@/hooks/haptics'

interface SwitchProps {
  defaultValue: boolean,
  onChange: () => void,
  thumbIcon: React.ReactNode,
  enabled: boolean
}

const Switch = ({defaultValue = false, onChange, thumbIcon, enabled = true}: SwitchProps) => {
  
  const [value, setValue] = useState<boolean | null>(defaultValue)
  const { handleViber } = haptics()
  
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])
  
  return (
    <Pressable onPress={ async () => {
      enabled && await handleViber.Strong()
      enabled && typeof onChange == 'function' && onChange(!prev)
      enabled && setValue((prev) => !prev)
    }} style={{
      width: 50,
      height: 30,
      backgroundColor: value? '#6a69fe' : '#3a3a3a',
      borderRadius: 50,
      padding: 4,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: value? 'flex-end' : 'flex-start',
      //borderWidth: 1,
      //borderColor: '#212121',
      opacity: enabled? 1 : .3,
    }}>
      <View style={[{
        height: 24,
        width: 24,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }, {
        //transform: [{ translateX }],
      }]}>
        {thumbIcon}
      </View>
    </Pressable>
  );
};

export default Switch;