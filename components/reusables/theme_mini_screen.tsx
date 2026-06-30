import Image from './Image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { ArrowLeft } from 'lucide-react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image02Icon, MicIcon, SettingsIcon, CallAdd02Icon, Mic02Icon, AddCircleIcon } from '@hugeicons/core-free-icons';
import { backgroundImage } from '@/utils/backgrounds'

const { width, height } = Dimensions.get('window');

const ThemeMiniScreen = ({name = 'Name', bubble_color = '#5E4BFA', avatar, bg_opacity, background}) => {
  const [opacityValue, setOpacityValue] = React.useState(bg_opacity)
  const [bubble, setBubble_color] = React.useState(bubble_color)
  const [bg_uri, setBg_uri] = useState(background)
  
  React.useEffect(() => {
    setOpacityValue(bg_opacity)
  }, [bg_opacity])
  
  React.useEffect(() => {
    setBubble_color(bubble_color)
  }, [bubble_color])
  
  React.useEffect(() => {
    setBg_uri(background)
  }, [background])
  
  const messages = [
    {
      content: 'This is a preview of a message bubble',
      side: 'left',
      color: '#171717'
    },
    {
      content: "When changing the bubble color, it's only available for you",
      side: 'right',
      color: bubble
    },
  ]
  
  return (
    <ImageBackground imageStyle={{
      opacity: opacityValue
    }} source={backgroundImage(bg_uri)} resizeMode='cover' style={{
      height: 450,
      width: 230,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#262626',
      //transform: 'scale(1.3)',
      overflow: 'hidden',
    }}>
      <View style={{
        width: '100%',
        alignItems: 'center',
        //height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0a0a0a',
        //borderBottomWidth: 1,
        //borderColor: 'red',
        padding: 17,
        paddingHorizontal: 10,
        paddingBottom: 8,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5
        }}>
          <ArrowLeft size={16} color='white'/>
          <Image size={20} src={avatar}/>
          <Text numberOfLines={1} style={{
            color: 'white',
            fontSize: 11,
          }}>{name}</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20
        }}>
          <HugeiconsIcon size={15} icon={CallAdd02Icon} color='white'/>
          <HugeiconsIcon size={15} icon={SettingsIcon} color='white'/>
        </View>
        <View style={{display: 'none'}}></View>
      </View>
      <View style={{
        flex: 1,
      }}>
        {messages.map((m, i) => (
          <View key={i} style={{
            flexDirection: 'row',
            alignSelf: m.side == 'left'? 'flex-start' : 'flex-end',
            gap: 3,
            alignItems: 'flex-end',
            width: '70%',
            paddingLeft: m.side == 'left' && 5,
            paddingRight: m.side == 'right' && 5,
            marginVertical: m.side == 'left' && 10,
          }}>
            {m.side == 'left' && <Image size={16} src={avatar}/>}
            <View style={{
              gap: 1
            }}>
              <View style={{
                padding: 7.5,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: m.color,
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 9.5,
                }}>{m.content}</Text>
              </View>
              {m.side == 'right' && <Text style={{
                color: 'darkgrey',
                fontSize: 8.5,
                alignSelf: 'flex-end',
                marginRight: 2,
              }}>Delivered</Text>}
            </View>
          </View>
        ))}
      </View>
    </ImageBackground>
  );
};

export default ThemeMiniScreen