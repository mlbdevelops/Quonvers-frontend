import Image from '../../../../components/reusables/Image';
import Button from '../../../../components/reusables/button';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router'
import PostPreview from '@/components/reusables/post_preview'
import Header from '@/components/header'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image02Icon, MicIcon, SettingsIcon, VideoIcon, ImagesIcon, CallAdd02Icon, AudioWave01Icon, Mic02Icon, AddCircleIcon, SmileIcon, SentIcon, Check01Icon, Comment03Icon } from '@hugeicons/core-free-icons';
import haptics from '@/hooks/haptics'
import { useAnimatedKeyboard } from "react-native-keyboard-controller";
import { ArrowUp, Ellipsis } from 'lucide-react-native'
import { useKeyboard } from '@/hooks/keyboard';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'
import ReplyComp from '@/components/reusables/comment'
import Thought from '@/components/reusables/post/thought'

const MainPost = () => {
  const { post: StringPost } = useLocalSearchParams()
  const post = JSON.parse(StringPost);
  const [input, setInput] = useState('')
  const insets = useSafeAreaInsets()
  const { handleViber } = haptics()
  const { isKeyboardOpen } = useKeyboard()
  const [isLoading, setIsLoading] = useState(false)
  const { height, progress } = useAnimatedKeyboard();
  
  const [replies, setReplies] = useState([
    {
      replyText: 'Damn, she really made it 😂😆',
      author_username: 'joshnorman'
    },
    {
      replyText: "Okay, now i feel attacked 🙃, it's like it's meant to be me",
      author_username: 'sarah_ven'
    },
    {
      replyText: 'i can relate 😔',
      author_username: 'markus_j'
    },
    {
      replyText: 'Sounds impressive, i need to make a team, would you like to join',
      author_username: 'anime_dealers'
    },
  ])
  
  const senderSizeValue = useSharedValue(0)
  const scaleButtonValue = useSharedValue(0)
  
  const senderButtonStyle = useAnimatedStyle(() => ({
    height: senderSizeValue.value,
    width: senderSizeValue.value,
    transform: [{ scale: scaleButtonValue.value }],
  }))
  
  useEffect(() => {
    if (input) {
      senderSizeValue.value = withTiming(45, { duration: 100 })
      return scaleButtonValue.value = withTiming(1, { duration: 250 })
    }
    senderSizeValue.value = withTiming(0, { duration: 250 })
    scaleButtonValue.value = withTiming(0, { duration: 250 })
  }, [input])
  
  const reply = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setInput('')
    }, 1000);
  }
  
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerShown: true
      }}/>
      <Header isBack title={'Moment'} headerRight={
        <TouchableOpacity 
          onPress={() => {
            //setOptions(true)
            handleViber.Medium()
          }} 
          style={{
            //backgroundColor: '#1d1d1d',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            borderRadius: 50,
            height: 25,
            width: 25,
            borderWidth: 1,
            borderColor: 'white',
          }}
        >
          <Ellipsis size={17.5} color='white' />
        </TouchableOpacity>
      }/>
      <View style={{
        width: '100%',
        paddingHorizontal: 5,
      }}>
        <PostPreview post={post}/>
        <View style={{
          width: '100%',
          flexDirection: 'row',
          gap: 10,
          paddingVertical: 15,
        }}>
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            //marginTop: 10,
            borderColor: '#1d1d1d',
          }}>Replies</Text>
          <Text style={{
            color: 'black',
            fontWeight: 'bold',
            //marginTop: 10,
            borderColor: '#1d1d1d',
            padding: 1,
            paddingHorizontal: 6,
            backgroundColor: 'white',
            borderRadius: 50,
          }}>{replies.length}</Text>
        </View>
      </View>
      
      
      {/*<View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isKeyboardOpen? 0 : 1,
      }}>
        <HugeiconsIcon icon={Comment03Icon} color='white' size={65}/>
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
          marginTop: 10,
          marginBottom: 5,
        }}>No replies yet</Text>
        <Text style={{
          color: 'darkgray',
        }}>Replies will appear here.</Text>
        
      </View>
      
      <View style={{
        flex: 1,
        //alignItems: 'center',
        gap: 20,
        marginTop: 15,
        paddingHorizontal: 5,
        overflow: 'hidden',
      }}>
        
      </View>*/}
      
      <FlatList 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        containerStyle={{
          flex: 1,
          //alignItems: 'center',
          gap: 20,
          marginTop: 15,
          paddingHorizontal: 5,
        }}
        data={replies} 
        //keyExtractor={(item) => item.id} 
        renderItem={({ item: reply, index }) => 
          <ReplyComp key={index} reply={reply}/>
        }
      />
      
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        //placeItems: 'end',
        marginTop: 8.5,
        borderWidth: 0,
        borderColor: 'white',
        marginBottom: insets.bottom? (insets.bottom + 10) : 8.5 || 8.5,
        gap: input && 6,
      }}>
        <View style={{
          flex: 1,
          borderRadius: 25,
          minHeight: 45,
          backgroundColor: '#1d1d1d',
          paddingVertical: 5,
          paddingHorizontal: 10,
          paddingLeft: 5,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 5
        }}>
         
         <Image style={{
            height: 35,
            width: 35,
            backgroundColor: '#262626',
          }} avatar />
          
          <TextInput 
            cursorColor='#6a69fe' 
            maxHeight={100} 
            value={input} 
            onChangeText={(val) => setInput(val)} 
            placeholderTextColor='darkgray' 
            multiline 
            selectionColor="#6a69fe"
            placeholder='Reply here...' 
            style={{
              flex: 1,
              color: 'white',
              minHeight: 35,
              borderWidth: 0,
              borderColor: 'white',
              padding: 0,
              marginLeft: 5,
            }}
          />
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
            height: 35,
          }}>
            <HugeiconsIcon 
              icon={SmileIcon} 
              color='white'
              style={{
                marginRight: 30,
              }}
            />
            {!input && <HugeiconsIcon icon={Mic02Icon} color='white'/>}
            {!input && <HugeiconsIcon icon={Image02Icon} color='white'/>}
          </View>
        </View>
        <Animated.View style={[{
          height: 45,
          width: 45,
          alignItems: 'center',
          justifyContent: 'center',
        }, senderButtonStyle]}>
          <Button loading={isLoading} onPress={async() => {
            input && await handleViber.Strong()
            reply()
          }} title={<ArrowUp color='white'/>} style={{
            height: 45,
            width: 45,
            margin: 0,
            //flex: 1,
            borderRadius: 50,
          }}/>
        </Animated.View>
      </View>
      <Animated.View 
        style={[{ height }]}>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
});

export default MainPost;