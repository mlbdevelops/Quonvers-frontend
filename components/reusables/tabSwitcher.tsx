import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import haptics from '@/hooks/haptics'

const TabSwitcher = ({show = true, options = [], index = 0, onChange, style, itemStyle, disabledIndex = null}: {show: boolean, options: any[], index: number, onChange: () => void, style: any, itemStyle: any, disabledIndex: number | null}) => {
  const [currentIndex, setCurrentIndex] = useState(index)
  const { handleViber } = haptics()
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderRadius: 15,
      height: 40,
      backgroundColor: '#1d1d1db9',
      padding: 4,
      //borderWidth: 1,
      //borderColor: '#262626',
      justifyContent: 'space-between',
      display: !show && 'none',
      ...style
    }}>
      {options.map((o, i) => (
        <TouchableOpacity activeOpacity={.5} key={i} onPress={ async () => { 
          await setCurrentIndex(i)
          typeof onChange == 'function' && onChange({index: i, title: o})
          await handleViber.Medium()
        }} style={{
          height: '100%',
          flex: 1,
          borderRadius: 12,
          backgroundColor: currentIndex == i? '#ffffff28' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          ...itemStyle
        }}>
          <Text style={{
            color: 'white',
          }}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabSwitcher;