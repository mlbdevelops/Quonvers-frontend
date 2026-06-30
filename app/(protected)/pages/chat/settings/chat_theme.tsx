import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable, View, Text, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import Header from '@/components/header'
import ThemeMiniScreen from '@/components/reusables/theme_mini_screen'
import { ChevronRight } from 'lucide-react-native'
import { useLocalSearchParams } from 'expo-router'
import Button from '@/components/reusables/button'
import Slider from '@react-native-community/slider'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getDb } from '@/storage/db'
import AppEvent, { Events } from '@/utils/eventEmitter'
import { router } from 'expo-router'
import haptics from '@/hooks/haptics'
import {
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Sheet from '@/components/reusables/bottomSheet'

export default function theme() {
  const scale = useSharedValue(1);
  const { name, avatar, chat_id } = useLocalSearchParams()
  const [dbThemeSettings, setDbThemeSettings] = useState<any | null>(null)
  const [bg_uri, setBg_uri] = useState(null)
  const [bubble_color, setBubble_color] = useState('#5E4BFA')
  const { handleViber } = haptics()
  const [brightness, setBrightness] = useState(0.2)
  const [sourceType, setSourceType] = useState(dbThemeSettings?.source_type)
  const brightnessVelues = [0.2, 0.4, 0.6, 0.8, 1]
  
  useEffect(() => {
    (async () => {
      const db = await getDb()
      const getThemeSettings = await db.getFirstAsync('SELECT * FROM chat_theme WHERE chat_id = ?', [chat_id])
      setBg_uri(getThemeSettings?.bg_uri)
      setDbThemeSettings(getThemeSettings)
      setBrightness(getThemeSettings?.bg_opacity)
      if(getThemeSettings?.bubble_color) setBubble_color(getThemeSettings?.bubble_color)
    })()
  }, [])
  
  useEffect(() => {
    AppEvent.on(Events.CHAT_THEME_CHANGE, (data) => {
      if(chat_id !== data.chat_id) return
      if(data.bubble_color) setBubble_color(data.bubble_color)
      if(data.bg_uri) setBg_uri(data.bg_uri)
    })
  }, [])
  
  const saveBrightness = async (brValue) => {
    const db = await getDb()
    try {
      handleViber.Medium()
      if(!dbThemeSettings?.chat_id){
        await db.runAsync(`
          INSERT OR IGNORE INTO chat_theme (
            chat_id,
            bg_opacity
          )
          VALUES(?, ?)
        `, [chat_id, brValue])
      }else{
        await db.runAsync(`
          UPDATE chat_theme 
          SET bg_opacity = ?
          WHERE chat_id = ?
        `, [brValue, chat_id])
      }
    } catch (error) {
      console.error(error);
    }finally{
      setBrightness(brValue)
      AppEvent.emit(Events.CHAT_THEME_CHANGE, {chat_id, brightness: brValue})
    }
  }
  
  const options = [
    {
      label: 'Bubble color',
      action: () => router.push(
        {
          pathname: '/pages/chat/settings/chat_theme/colors', 
          params: {chat_id, avatar, paramsColor: bubble_color}
        }
      ),
      activeColor: bubble_color
    },
    {
      label: 'Chat background',
      action: () => router.push(
        {
          pathname: '/pages/chat/settings/chat_theme/chat_backgrounds', 
          params: {chat_id, avatar, initialUri: bg_uri}
        }
      ),
      activeColor: null
    }
  ]
  
  return (
    <ScrollView 
      style={{ flex: 1, }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      containerStyle={{
        alignItems: 'center',
      }}
    >
      <Header title={'Chat theme'} isBack styleType={'chat_settings'}/>
      <View style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        //transform: [{ scale: 1.2 }],
      }}>
        <ThemeMiniScreen 
          name={name} 
          avatar={avatar}
          bg_opacity={brightness}
          bubble_color={bubble_color}
          background={bg_uri}
        />
        <View style={{
          width: '95%',
        }}>
          <Text style={{
            paddingHorizontal: 20,
            marginTop: 25,
            color: 'darkgrey',
            textAlign: 'left',
          }}>Customize</Text>
        </View>
        <View style={{
          backgroundColor: '#171717',
          width: '95%',
          paddingVertical: 7,
          //paddingHorizontal: 20,
          borderRadius: 20,
          marginVertical: 10,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            width: '100%',
            padding: 15,
          }}>
            <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 3, fontSize: 15,}}>Brightness</Text>
            {/*<Slider 
              minimumTrackTintColor="#6a69fe"
              maximumTrackTintColor="#6a69fe"
              thumbTintColor="white"
              value={0.3}
              maximumValue={1}
              minimumValue={0.0}
              position='vertical'
              onValueChange={(val) => setbg_opacity(val)}
              style={{
                width: '77%',
              }}
            />*/}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10
            }}>
              {[1, 2, 3, 4, 5].map((o, i) => (
                <TouchableOpacity key={i} onPress={() => saveBrightness(brightnessVelues[i])} style={{
                  height: 30,
                  width: 30,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: brightnessVelues[i] == brightness? '#6a69fe' : 'darkgrey',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: brightnessVelues[i] == brightness? '#6a69fe' : 'darkgrey',
                  }}>{o}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {options.map((o, i) => (
            <TouchableOpacity onPress={o.action} key={i} style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
              paddingHorizontal: 18,
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
              }}>{o.label}</Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10
              }}>
                <View style={{
                  height: 20,
                  width: 20,
                  borderRadius: 50,
                  backgroundColor: o.activeColor,
                }}></View>
                <ChevronRight color={'darkgrey'} size={15}/>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}