//import UseMediaPicker from '../../../../../../hooks/useMediaPicker';
//import Image from '../../../../../../components/reusables/Image';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import Header from '@/components/header'
import { ArrayBackgrounds } from '@/utils/backgrounds'
import { getDb } from '@/storage/db'
import { useLocalSearchParams } from 'expo-router'
import AppEvent, { Events } from '@/utils/eventEmitter';
import haptics from '@/hooks/haptics'
import { Check } from 'lucide-react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { AddCircleIcon, PhotoIcon } from '@hugeicons/core-free-icons';
import { UseMediaPicker } from '@/hooks/useMediaPicker'

const { width: sWidth, height: sHeight } = Dimensions.get('window')

const ChatBackgrounds = () => {
  const { chat_id, initialUri } = useLocalSearchParams()
  const [initialBg, setinitialBg] = useState(initialUri)
  const [selected, setSelected] = useState(initialBg || 'bg_default')
  const [onShowMedias, setOnShowMedias] = useState(false)
  const [local_image_uri, setLocal_image_uri] = useState(null)
  const { handleViber } = haptics()
  useEffect(() => {
    (async () => {
      const db = await getDb()
      const getBgSettings = await db.getFirstAsync('SELECT bg_uri, chat_id FROM chat_theme WHERE chat_id = ?', [chat_id])
      setSelected(getBgSettings?.bg_uri || 'bg_default')
      setinitialBg(getBgSettings)
    })()
  }, [])
  
  const setLocal = async (image_uri) => {
    try {
      setOnShowMedias(false)
      await change(image_uri?.uri)
      console.log(image_uri)
    } catch (error) {
      console.error(error);
    }
  }
  
  const change = async (bg_uri) => {
    try {
      if(!bg_uri) return
      if(bg_uri === initialBg?.bg_uri) return
      const db = await getDb()
      handleViber.Medium()
      if(initialBg){
        console.log('Updating...')
        await db.runAsync(`
          UPDATE chat_theme
          SET bg_uri = ?
          WHERE chat_id = ?
        `, [bg_uri, chat_id])
      }else{
        console.log('Saving...')
        await db.runAsync(`
          INSERT INTO chat_theme (
            bg_uri,
            chat_id
          )
          VALUES(?, ?)
        `, [bg_uri, chat_id])
      }
    } catch (error) {
      console.error(error);
    }finally{
      setSelected(bg_uri)
      setLocal_image_uri(bg_uri)
      AppEvent.emit(Events.CHAT_THEME_CHANGE, {chat_id, bg_uri})
    }
  }
  
  const src = (item) => {
    return item.name === 'photo_upload' ? { uri: local_image_uri || initialBg?.bg_uri } : item.path
  }
  
  return (
    <View style={styles.container}>
      <Header isBack title={'Chat background'} styleType='chat_settings'/>
      {onShowMedias && <UseMediaPicker scopes={['photo']} onClose={() => setOnShowMedias(false)} onPick={setLocal}/>}
      <FlatList 
        data={ArrayBackgrounds}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => item.name === 'photo_upload' ? setOnShowMedias(true) : change(item.name)} style={{
            width: sWidth / 3,
            height: sHeight / 3.9,
            padding: 6,
            alignItems:'center',
            justifyContent: 'center',
          }}>
            <Image  style={{
              width: '100%',
              height: '100%',
              borderRadius: 20,
              //display: item?.not_wall? 'none' : undefined,
              borderWidth: item.name == selected ? 0 : 1,
              borderColor: '#262626',
              outlineColor: 'white',
              //outlineOffset: 3,
              outlineWidth: item.name == selected ? 2 : 0
            }} source={src(item)} />
            <View style={{
              borderWidth: 1,
              alignItems:'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              borderRadius: 20,
              borderColor: '#262626',
              gap: 10,
              display: !item?.not_wall? 'none' : undefined,
              position: 'absolute',
              backgroundColor: '#1d1d1d30',
              outlineColor: 'white',
              //outlineOffset: 3,
              outlineWidth: !selected.startsWith('bg_') ? 2 : 0
            }}>
              <HugeiconsIcon strokeWidth={2} icon={AddCircleIcon} color={'white'}/>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
              }}>Gallery</Text>
            </View>
            <View style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              display: item.name == selected ? undefined : 'none',
            }}>
              <Check color={'black'}/>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default ChatBackgrounds;