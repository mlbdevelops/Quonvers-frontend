import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import haptics from '@/hooks/haptics'

const TabSwitcher = ({show = true, options = [], index = 0, onChange, style, itemStyle, disabledIndex = null, activeBg, labelStyle, activeLabel, inactiveLabel = 'white', inactiveBg}: {show: boolean, options: any[], index: number, onChange: () => void, style: any, itemStyle: any, disabledIndex: number | null, activeBg: string | null, labelStyle: any | null, activeLabel: string, inactiveLabel: string, inactiveBg: any}) => {
  const [currentIndex, setCurrentIndex] = useState(index)
  const { handleViber } = haptics()
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderRadius: 15,
      height: 40,
      //backgroundColor: '#1d1d1db9',
      //padding: 4,
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
          //borderRadius: 12,
          backgroundColor: activeBg && (currentIndex == i? activeBg : inactiveBg) || inactiveBg,
          alignItems: 'center',
          borderBottomWidth: 2,
          borderColor: currentIndex == i? '#6a69fe' : 'transparent',
          justifyContent: 'center',
          ...itemStyle
        }}>
          <Text style={{
            color: activeLabel && (currentIndex == i? activeLabel : inactiveLabel) || inactiveLabel,
            ...labelStyle
          }}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabSwitcher;