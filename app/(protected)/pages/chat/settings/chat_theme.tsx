import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Header from '@/components/header'
import ThemeMiniScreen from '@/components/reusables/theme_mini_screen'
import { ChevronRight } from 'lucide-react-native'
import { useLocalSearchParams } from 'expo-router'
import Button from '@/components/reusables/button'
import Slider from '@react-native-community/slider'
import { useState, useEffect } from 'react'

export default function theme() {
  const scale = useSharedValue(1);
  const { name, avatar } = useLocalSearchParams()
  const [opacityValue, setOpacityValue] = useState(0.3)
  
  const options = [
    {
      label: 'Bubble color',
      action: null,
      activeColor: '#6a69fe'
    },
    {
      label: 'Chat background',
      action: null,
      activeColor: null
    },
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
          bg_opacity={opacityValue}
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
            <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 3, fontSize: 15,}}>Opacity</Text>
            <Slider 
              minimumTrackTintColor="#6a69fe"
              maximumTrackTintColor="#6a69fe"
              thumbTintColor="white"
              value={0.3}
              maximumValue={1}
              minimumValue={0.0}
              position='vertical'
              onValueChange={(val) => setOpacityValue(val)}
              style={{
                width: '77%',
              }}
            />
          </View>
          {options.map((o, i) => (
            <TouchableOpacity key={i} style={{
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
        <Button flat title={'Reset default'}/>
      </View>
    </ScrollView>
  );
}
