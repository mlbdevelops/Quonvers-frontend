import Switch from '@/components/reusables/switch';
import Image from '@/components/reusables/Image';
import Button from '@/components/reusables/button.tsx'
import haptics from '@/hooks/haptics'
import Header from '@/components//header';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView, Pressable } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { withLayoutContext, useLocalSearchParams } from 'expo-router'
import userContext from '@/hooks/useUser'
import { HugeiconsIcon } from '@hugeicons/react-native';
import Animated from 'react-native-reanimated'
import { Image02Icon, MicIcon, SearchIcon, UserCircleIcon, AddCircleIcon, AddIcon, PlayCircleIcon, BubbleChatSparkIcon, LocationIcon, SmileIcon, StickerIcon, PollIcon, TimelineListIcon, BubbleChatQuestionIcon, QuestionIcon } from '@hugeicons/core-free-icons';
import { Globe, Lock, Ellipsis, ChevronRight, ChevronDown, Sticker, X } from 'lucide-react-native';
import { useAnimatedKeyboard } from "react-native-keyboard-controller";
import { useCustomAlert } from '@/hooks/alert'
import trans from '@/hooks/fetch'
import SheetComp from '@/components/modal_pages/create_post/sheet'
import { router } from 'expo-router'
import { scale } from '@/hooks/micro_animations'
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { toast } from "@/utils/toaster/toast"
import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DotsButton from '@/components/reusables/dots'

const { Navigator } = createStackNavigator()
const Stack = withLayoutContext(Navigator)

const CreateMoment = () => {
  const words = [
    'Express yourself',
    'Talk',
    'Join the convenversation',
    'Or just chill',
  ];
  
  const { open_type } = useLocalSearchParams()
  const [type, setType] = React.useState(open_type)
  const { user } = userContext()
  const { height, progress } = useAnimatedKeyboard();
  const placeHolderRef = useRef(words[0]);
  const [placeholder, setPlaceholder] = useState(() => placeHolderRef.current)
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isThougth, setisThougth] = useState(open_type == 'thought')
  console.log(isThougth, open_type);
  const { handleViber } = haptics ()
  const [createPostLoading, setCreatePostLoading] = useState(false)
  const [inputSurname, setInputSurname] = useState('')
  const [inputContent, setInputContent] = useState('')
  const [requestMode, setRequestMode] = useState(2)
  const alert = useCustomAlert()
  const [options, setOptions] = useState(false)
  const [bottomOptionsHide, setBottomOptionsHide] = useState(false)
  const [netWorkRetriesTime, setNetWorkRetriesTime] = useState(0)
  const heightValue = useSharedValue(35)
  const sheetRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const openSheet = () => {
    const bts = sheetRef.current
    if(bts){
      bts?.expand()
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }))
  
  const heightValueChange = (toValue = 0) => {
    heightValue.value = withTiming(toValue, { duration: 100})
  }
  
  const marginValue = useSharedValue(10)
  
  const marginStyle = useAnimatedStyle(() => ({
    marginBottom: marginValue.value,
  }))
  
  const mBottomValueChange = (toValue = 0) => {
    marginValue.value = withTiming(toValue, { duration: 100})
  }
  
  const opacityValue = useSharedValue(1)
  
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }))
  
  const opacityValueChange = (toValue = 0) => {
    opacityValue.value = withTiming(toValue, { duration: 100})
  }
  
  useEffect(() => {
    if (isThougth) {
      heightValueChange(0)
      opacityValueChange(0)
      mBottomValueChange(0)
    }else{
      opacityValueChange(1)
      mBottomValueChange(10)
      heightValueChange(35)
    }
  }, [])
  
  
  useEffect(() => {
    const currentWord = words[wordIndex];
    const typingSpeed = 30;
    const deletingSpeed = 5;
    const wordDelay = 1200;
    let timer;
    
    if (!isDeleting && placeHolderRef.current.length < currentWord.length) {
      timer = setTimeout(() => {
        placeHolderRef.current = placeHolderRef.current + currentWord[placeHolderRef.current.length]
      }, typingSpeed);
    } else if (isDeleting && placeHolderRef.current.length > 0) {
      timer = setTimeout(() => {
        placeHolderRef.current = placeHolderRef.current.substring(0, placeHolderRef.current.length - 1);
      }, deletingSpeed);
    } else if (!isDeleting && placeHolderRef.current.length === currentWord.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, wordDelay);
    } else if (isDeleting && placeHolderRef.current.length === 0) {
    setIsDeleting(false);
    setWordIndex(prev => (prev + 1) % words.length);
    }
    return () => clearTimeout(timer);
  }, [placeHolderRef.current, isDeleting, wordIndex, words]);
  
  const createPost = async () => {
    try {
      if (!inputContent) {
        return
      }
      setCreatePostLoading(true)
      
      const post_model = {
        type: 'moment',
        content_type: 'text',
        main_url_content: null,
        caption: inputContent.trim(),
        allow_forwarding: false,
        visible_counts: false,
        is_pinned_at: null,
        share_to: null,
        notifications_on: true,
        is_anonymous: false,
        unlinked_to_profile: false,
        post_surname: inputSurname.trim(),
        created_at: Date.now(),
        post_at: Date.now(),
        expires_at: (Date.now() + 1000 * 60 * 60 * 24 * 30),
        post_location: 'Los Angeles - California',
        allow_screenshot: true,
        allow_save: false,
        extra_data: {
          tags: null,
          media_urls: [],
        }
      };
      
      const res = await trans('/api/post/_create', {
        useToken: true,
        body: post_model,
        errMsg: 'Failed to upload, please retry.'
      })
      
      if (res.success) {
        alert('Success', 'Successfully shared', [{text: 'Ok', primary: true}])
        return router.back()
      }
      
    } catch (error) {
      alert('Network error', 'Unable to share your moment, please check your internet connection and try again.', [
          {
            text: 'Ok',
            primary: true,
          }
        ]
      )
      console.log('error => ', error);
    } finally {
      setCreatePostLoading(false)
    }
  }
  
  return (
    <View style={styles.container}>
      <Header 
        backIcon={(<X color='white'/>)}
        isBack
        title={'New Moment'}
        headerRightContents={
          <Button loading={createPostLoading} onPress={createPost} style={{
            height: 32,
            width: 100,
            opacity: inputContent.trim() && !createPostLoading? 1 : inputContent.trim() && createPostLoading? .5 : .5,
          }} title={'Share'}/>
        }
      />
      <Stack.Screen options={{
        //animation: 'slide_from_bottom',
        headerShown: true,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}/>
        
        <BottomSheet
          ref={sheetRef}
          index={-1} // closed by default
          snapPoints={snapPoints}
          enablePanDownToClose={true}
        >
          <View style={{ padding: 20 }}>
            <Text style={{
              color: 'white',
            }}>Hello 👋 This is a bottom sheet</Text>
          </View>
        </BottomSheet>
        
        {options? <SheetComp onClose={() => setOptions(false)}/> : null}
        
        <View style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          //borderWidth: 1,
          //borderColor: 'white',
          width: '100%',
          marginTop: 10,
        }}>
          <Image avatar style={{
            height: 40,
            width: 40,
            borderRadius: 50,
          }}/>
          <View style={{
            gap: 5
          }}>
            <View style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
              }}>{user.name}</Text>
              <TextInput 
                placeholderColor='darkgray'
                placeholder='#Vibe...'
                cursorColor='#6a69fe'
                selectionColor='#6a69fe'
                value={inputSurname.slice(0, 15)}
                onChangeText={(value) => {
                  setInputSurname(value)
                }}
                style={{
                  color: 'white',
                  fontSize: 15,
                  //borderWidth: 1,
                  //borderColor: 'white',
                  padding: 0,
                  maxWidth: 200,
                }}
              />
            </View>
              <View style={{
                flexDirection: 'row',
                width: '92.5%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  gap: 5
                }}>
                  <View style={{
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    backgroundColor: '#1d1d1d',
                    borderRadius: 50,
                    gap: 5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: 105,
                  }}>
                    <Globe size={16.5} color='white'/>
                    <Text style={{
                      color: 'white',
                      fontWeight: 'bold',
                    }}>Public</Text>
                    <ChevronDown size={16.5} color='white'/>
                  </View>
                  <Animated.View style={[
                    opacityStyle
                  ]}>
                    <TouchableOpacity style={{
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      backgroundColor: '#1d1d1d',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      borderRadius: 50,
                      height: 33,
                    }}
                  >
                    <HugeiconsIcon strokeWidth={2} size={16.5} color='white' icon={LocationIcon} />
                  </TouchableOpacity>
                </Animated.View>
              </View>
              
              
              {/*The dots was here*/}
              
              
              
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{
          flex: 1,
        }}>
          <View style={{
            width: '100%',
            flex: 1,
          }}>
            <TextInput
              multiline
              maxLines={50}
              placeholder={"What's on your mind?"}
              placeholderColor='darkgray'
              cursorColor='#6a69fe'
              selectionColor="#6a69fe"
              autoFocus
              value={inputContent}
              onChangeText={(e) => setInputContent(e)}
              style={{
                width: '100%',
                marginTop: 10,
                fontSize: 17,
                //height: 400,
                //flex: 1,
                color: 'white',
                //backgroundColor: 'white',
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 15,
          }}
        >
          <View style={{
            gap: 20,
            flexDirection: 'row',
            alignItems: 'flex-end',
            alignSelf: 'flex-start',
          }}>
            {!isThougth? <HugeiconsIcon icon={Image02Icon} color='white'/> : null}
            {!isThougth? <HugeiconsIcon icon={PlayCircleIcon} color='white'/> : null}
            <HugeiconsIcon icon={MicIcon} color='white'/>
            <HugeiconsIcon icon={SmileIcon} color='white'/>
            {!isThougth? <HugeiconsIcon icon={TimelineListIcon} color='white'/> : null}
          </View>
          
          <DotsButton onPress={() => setOptions(true)}/>
          
          {/*<HugeiconsIcon icon={StickerIcon} color='white'/>*/}
        </View>
        <Animated.View style={{
          height,
        }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 15,
    //paddingBottom: 10
  },
});

export default CreateMoment;