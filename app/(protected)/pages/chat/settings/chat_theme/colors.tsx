import Image from '../../../../../../components/reusables/Image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Header from '@/components/header'
import { useLocalSearchParams } from 'expo-router'
import AppEvent, { Events } from '@/utils/eventEmitter'
import { getDb } from '@/storage/db'
import haptics from '@/hooks/haptics'

const { width: sWidth, height: sHeight } = Dimensions.get('window')

const Colors = () => {
  const { avatar, chat_id, paramsColor } = useLocalSearchParams()
  const { handleViber } = haptics()
  const colors = [
    {
      incoming: "#0a0a0a", 
      outgoing: "#5E4BFA",
    },
    {
      incoming: "#FCDCDD", 
      outgoing: "#B30006",
    },
    {
      incoming: "#1A2E1A", 
      outgoing: "#52B732",
    },
    {
      incoming: "#13233C", 
      outgoing: "#2A66B3",
    },
    {
      incoming: "#FFF4D4", 
      outgoing: "#4A3200",
    },
    {
      incoming: "#0F1626", 
      outgoing: "#3A7BD5"
    },
    {
      incoming: "#FFF0F5", 
      outgoing: "#D44D87"
    },
    {
      incoming: "#1F1D36", 
      outgoing: "#6E75A8"
    },
    {
      incoming: "#1C2A1E", 
      outgoing: "#718355"
    },
    {
      incoming: "#0B0C10", 
      outgoing: "#C3073F"
    },
    {
      outgoing: "#F28903", 
      incoming: "#C3073F"
    },
    {
      outgoing: "#3F416A", 
      incoming: "#C3073F"
    },
    {
      outgoing: "#9E3C0A", 
      incoming: "#C3073F"
    },
    {
      outgoing: "#434343", 
      incoming: "#C3073F"
    },
    {
      outgoing: "#713082", 
      incoming: "#C3073F"
    },
    {
      outgoing: "#92ac2a", 
      incoming: "#C3073F"
    },
    {
      outgoing: "#f145aa", 
      incoming: "#C3073F"
    },
  ]
  
  const [initialColor, setinitialColor] = useState(paramsColor)
  const [selected, setSelected] = useState<number | null>(initialColor ?? '#5E4BFA')
  
  useEffect(() => {
    (async () => {
      const db = await getDb()
      const getColorSettings = await db.getFirstAsync('SELECT bubble_color FROM chat_theme WHERE chat_id = ?', [chat_id])
      console.log(getColorSettings)
      if(getColorSettings?.bubble_color) setSelected(getColorSettings?.bubble_color)
      setinitialColor(getColorSettings?.bubble_color)
    })()
  }, [])
  
  const change = async (color) => {
    const db = await getDb()
    handleViber.Medium()
    try {
      if(!color) return
      if(color === initialColor) return
      if(initialColor){
        console.log('Updating...')
        await db.runAsync(`
          UPDATE chat_theme
          SET bubble_color = ?
          WHERE chat_id = ?
        `, [color, chat_id])
      }else{
        console.log('Saving...')
        await db.runAsync(`
          INSERT INTO chat_theme (
            bubble_color,
            chat_id
          )
          VALUES(?, ?)
        `, [color, chat_id])
      }
    } catch (error) {
      console.error(error);
    }finally{
      setSelected(color)
      AppEvent.emit(Events.CHAT_THEME_CHANGE, {chat_id, bubble_color: color})
    }
  }
  
  const prsns = ['reci', 'me']
  
  return (
    <View style={styles.container}>
      <Header title={'Bubble colors'} isBack styleType={'chat_settings'}/>
      <View style={{
        backgroundColor: '#171717',
        width: '100%',
        padding: 15,
        paddingHorizontal: 9,
        gap: 17
      }}>
        {prsns.map((p, i) => (
          <View key={i} style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            alignSelf: p == 'me'? 'flex-end' : 'flex-start',
            gap: 7
          }}>
            {p == 'reci' && <Image src={avatar} size={30}/>}
            <View key={i} style={{
              borderRadius: 20,
              backgroundColor: p == 'me' ? selected : '#262626',
              paddingVertical: 9,
              paddingHorizontal: 14,
              maxWidth: '70%',
            }}>
              <Text style={{
                color: 'white',
                fontSize: 15,
              }}>{p == 'me' ? 'The changed color is only visible to you' : 'This is a preview of bubble colors'}</Text>
            </View>
          </View>
        ))}
      </View>
      <FlatList
        data={colors}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={async () => {
            change(item.outgoing)
          }} key={index} style={{
            width: sWidth / 3,
            height: sWidth / 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={{
              height: 60,
              width: 60,
              borderRadius: 100,
              borderWidth: 4,
              borderColor: selected == item.outgoing? 'black' : 'transparent',
              outlineWidth: 3,
              outlineColor: selected == item.outgoing? 'white' : item.outgoing,
              backgroundColor: item.outgoing,
            }}/>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Colors;