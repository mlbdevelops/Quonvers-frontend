import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import haptics from '@/hooks/haptics'

const TabSwitcher = ({show = true, options = [], index = 0, onChange, style, itemStyle}: {show: boolean, options: any[], index: number, onChange: () => void, style: any, itemStyle: any}) => {
  const [currentIndex, setCurrentIndex] = useState(index)
  const { handleViber } = haptics()
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 35,
      backgroundColor: '#1d1d1db9',
      padding: 2,
      justifyContent: 'space-between',
      marginTop: 10,
      borderRadius: style?.borderRadius || 50,
      marginBottom: 10,
      display: !show && 'none',
      ...style
    }}>
      {options.map((o, i) => (
        <TouchableOpacity onPress={ async () => { 
          await setCurrentIndex(i)
          typeof onChange == 'function' && onChange({index: i, title: o})
          await handleViber.Medium()
        }} style={{
          height: '100%',
          flex: 1,
          borderRadius: 50,
          backgroundColor: currentIndex == i? 'white' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          ...itemStyle
        }}>
          <Text style={{
            color: currentIndex == i? 'black' : 'white',
          }}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabSwitcher;