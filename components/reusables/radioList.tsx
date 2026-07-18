import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import haptics from '@/hooks/haptics'

type RadioListProp = {
  defaultIndex: number | null,
  index: number | null,
  options: any[],
  onIndexChange: () => void,
  style: any,
  itemStyle: any,
  ui_notifier_index: string | null | undefined,
  ui_notifier_text: string | null | undefined
}

const RadioList = ({defaultIndex = 1, index, onIndexChange, options = [], style, ui_notifier_index, ui_notifier_text, itemStyle}: RadioListProp) => {
  const [initialIndex, setinitialIndex] = useState(defaultIndex)
  const { handleViber } = haptics()
  const [ui_index, setui_index] = useState(ui_notifier_index)
  
  useEffect(() => {
    setinitialIndex(defaultIndex)
  }, [defaultIndex])
  
  useEffect(() => {
    setui_index(ui_notifier_index)
  }, [ui_notifier_index])
  
  return (
    <View style={{
      gap: 10,
      padding: 10,
      backgroundColor: '#171717',
      borderRadius: 30,
      width: '95%',
      ...style
    }}>
      {options.map((o, i) => (
        <TouchableOpacity key={i} onPress={() => {
          onIndexChange({title: o, index: i + 1})
          //setinitialIndex(i)
          handleViber.Medium()
        }} style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 10,
          justifyContent: 'space-between',
          ...itemStyle
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
            <View style={{
              height: 20,
              width: 20,
              borderRadius: 100,
              outlineWidth: 1.5,
              backgroundColor: i + 1 === initialIndex? '#6a69fe' : 'transparent',
              borderWidth: 4,
              borderColor: '#1d1d1d',
              outlineColor: i + 1 === initialIndex? '#6a69fe' : 'white'
            }}></View>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{o}</Text>
          </View>
          {ui_index && ui_index - 1 == i && <Text style={{
            color: 'darkgray',
          }}>{ui_notifier_text || 'Selected'}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioList;