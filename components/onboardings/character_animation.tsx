import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { ChevronLeft } from 'lucide-react-native'

const CharacterAnimation = () => {
  const [completelyShown, setCompletelyShown] = useState(false)
  const initialEyeSize = useSharedValue(50)
  const completeShowRight = useSharedValue(-100)
  const translateXValues = useSharedValue(10)
  const translateYValues = useSharedValue(10)
  const opacityValue = useSharedValue(0)
  const eyeBrowsOpacity = useSharedValue(0)
  const toodleOpacity = useSharedValue(0)
  const [timeEyeTap, setTimeEyeTap] = useState(0)
  const [toodleWord, settoodleWord] = useState('')
  const [showToodleWord, setShowToodleWord] = useState(true)
  const [isGone, setIsGone] = useState(false)
  const opacity = useSharedValue(0)
  
  const toodleWords = [
    'Stop!',
    'Stop plzz!!',
    'Grrr!!!',
    'Grrrrrr',
  ]
  
  const changeOpacity = (value) => {
    opacity.value = withTiming(value, { duration: 300 })
  }
  
  useEffect(() => {
    if (isGone) {
      completeShowRight.value = withTiming(-100, { duration: 300 })
      opacityValue.value = withTiming(0, {
        duration: 400
      })
      eyeBrowsOpacity.value = withTiming(0, { duration: 200 })
      lookCenter()
      setCompletelyShown(false)
    }
  }, [isGone])
  
  
  const blackb = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateXValues.value },
      { translateY: translateYValues.value }
    ],
  }))
  
  const eyeBrows = useAnimatedStyle(() => ({
    opacity: eyeBrowsOpacity.value,
  }))
  
  const opacityAnimation = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))
  
  const showToodleOpacity = useAnimatedStyle(() => ({
    opacity: toodleOpacity.value,
  }))
  
  useEffect(() => {
    setTimeout(() => {
      completeShowRight.value = withTiming(0, { duration: 300 })
      opacityValue.value = withTiming(1, {
        duration: 400
      })
      setTimeout(() => {
        snapHeight()
      }, 700);
      setTimeout(() => {
        snapHeight()
      }, 1200);
    }, 1200);
    setTimeout(() => {
      setCompletelyShown(true)
    }, 400);
  }, [])
  
  const animatedStyle = useAnimatedStyle(() => ({
    height: initialEyeSize.value,
  }))
  
  const toodleStyle = useAnimatedStyle(() => ({
    left: completeShowRight.value,
    opacity: opacityValue.value,
  }))
  
  
  const snapHeight = (targetValue = 0) => {
    initialEyeSize.value = withTiming(targetValue, { duration : 100})
    setTimeout(() => {
      initialEyeSize.value = withTiming(50, { duration : 100})
    }, 200);
  }
  
  const eyebrowsShow = () => {
    snapHeight()
    setTimeout(() => {
      eyeBrowsOpacity.value = withTiming(1, {duration: 200})
    }, 300);
  }
  
  // 0, 17 look at the logo
  // 20, 17 look at the bottom
  
  const lookLogo = async () => {
    translateYValues.value = withTiming(0, { duration: 350 })
    translateXValues.value = withTiming(17, { duration: 350 })
  }
  
  const lookBottom = () => {
    translateYValues.value = withTiming(20, { duration: 350 })
    translateXValues.value = withTiming(17, { duration: 350 })
  }
  
  const lookCenter = () => {
    translateYValues.value = withTiming(12, { duration: 350 })
    translateXValues.value = withTiming(12, { duration: 350 })
  }
  
  const globalStylingFunc = async () => {
    setTimeout( async () => {
      await lookLogo()
    }, 2000);
    
    setTimeout( async () => {
      await lookBottom()
    }, 5000);
    
    setTimeout( async () => {
      await snapHeight()
      lookCenter()
    }, 7000);
    
  }
  
  useEffect(() => {
    setInterval( async () => {
      if (!completelyShown) {
        return
      }
      await globalStylingFunc()
    }, 9000);
  }, [completelyShown])
  
  const changeToodleWord = () => {
    setTimeout(() => {
      setShowToodleWord(true)
      toodleOpacity.value = withTiming(1, { duration: 300 })
    }, 500);
    console.log(timeEyeTap);
    settoodleWord(toodleWords[timeEyeTap])
    setTimeout(() => {
      toodleOpacity.value = withTiming(0, { duration: 300 })
      setShowToodleWord(true)
    }, 3000);
  }
  
  return (
    <View style={styles.container}>
      
      {isGone &&
        <Pressable style={{
          left: 0,
          position: 'absolute',
          top: '48%',
        }} onPress={() => {
          changeOpacity(0)
          setTimeout(() => {
            completeShowRight.value = withTiming(0, { duration: 300 })
            opacityValue.value = withTiming(1, {
              duration: 400
            })
            setTimeout(() => {
              snapHeight()
            }, 700);
            setTimeout(() => {
              snapHeight()
            }, 1200);
          }, 1200);
          setTimeout(() => {
            setCompletelyShown(true)
          }, 400);
          setTimeout(() => {
            setIsGone(false)
          }, 300);
        }}>
          <Animated.View style={[{
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
            //backgroundColor: '#171717',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 5,
            //borderWidth: 1,
            //borderColor: '#6a69fe88',
            borderLeftWidth: 0,
            //padding: 10,
          }, opacityAnimation]}>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              //borderWidth: 1.5,
              borderColor: '#6a69fe',
              borderStyle: 'dashed',
              borderRadius: 50,
              paddingHorizontal: 15,
              flexDirection: 'row',
            }}>
              <ChevronLeft size={20} style={{
                padding: 0,
              }} color={'#6a69fe'}/>
              <ChevronLeft size={20} style={{
                padding: 0,
              }} color={'#6a69fe'}/>
              <Text style={{
                color: '#6a69fe',
                fontWeight: 'bold',
                fontSize: 16,
              }}>Apologize</Text>
            </View>
          </Animated.View>
        </Pressable>
      }
      
      <Animated.View style={[{
        flexDirection: 'row',
        position: 'absolute',
        left: '47%',
        top: '30%',
        gap: 20,
        //borderWidth: 1,
        borderColor: 'white',
        width: 120,
        height: 100,
        maxWidth: 300,
      }, showToodleOpacity]}>
        {[1, 2].map((dot, i) => (
          <Animated.View style={{
            width: i == 0? 15 : 25,
            height: i == 0? 15 : 25,
            backgroundColor: timeEyeTap == 3 || timeEyeTap == 4? '#ff3e3e' : '#262626',
            bottom: i == 0? 0 : '15%',
            borderRadius: '50%',
            left: i == 0? 0 : '15%',
            position: 'absolute',
          }}></Animated.View>
        ))}
        
        <Animated.View style={{
          position: 'absolute',
          right: 0,
          //top: '40%',
          //transform: [{ rotate: '-30deg' }],
          backgroundColor: timeEyeTap == 3 || timeEyeTap == 4? '#ff3e3e' : '#262626',
          borderRadius: 100,
          padding: 15,
          paddingVertical: 10,
        }}>
          <Text numberOfLines={1} style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 24,
            maxWidth: 100,
            textAlign: 'center',
            textShadowColor : '#6a69fe',
            whiteSpace: 'nowrap',
            //textShadowColorOffset : 1,
            textShadowRadius: {
              width: 10,
              height: 10,
            }
          }}>{toodleWord}</Text>
        </Animated.View>
      </Animated.View>
      
      <Animated.View style={[{
        height: 150,
        width: 180,
        backgroundColor: '#6a69fe',
        position: 'absolute',
        bottom: 300,
        left: 0,
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 30,
        borderTopRightRadius: 999999,
        borderBottomRightRadius: 999999,
      }, toodleStyle]}>
        <Pressable onTouchStart={() => {
          if (!completelyShown) {
            return
          }
          setTimeEyeTap((prev) => prev >= 3? 0 : prev + 1)
          if (timeEyeTap >= 2) {
            eyebrowsShow()
          }
          if (timeEyeTap >= 3) {
            setTimeout(() => {
              setIsGone(true)
            }, 2000);
            setTimeout(() => {
              changeOpacity(1)
            }, 3000);
          }
          snapHeight()
          setTimeout(() => {
            lookCenter()
          }, 300);
          changeToodleWord()
        }} style={{
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
          //position: 'absolute',
          justifyContent: 'center',
        }}>
          {[1,2].map((eye, i) => (
            <>
              <Animated.View style={[{
                height: 10,
                width: '48%',
                backgroundColor: 'black',
                borderRadius: 5,
                position: 'absolute',
                top: 0,
                zIndex: 1,
                right: i == 0? undefined : 0,
                left: i == 1? undefined : 0,
                transform: [{ rotate: i == 0? '15deg': '-15deg' }],
              }, eyeBrows]}></Animated.View>
              
              <Animated.View key={i} style={[{
                height: 50,
                width: 50,
                backgroundColor: 'white',
                borderRadius: '50%',
                overflow: 'hidden',
              },
                animatedStyle
              ]}>
                <Animated.View style={[{
                  height: '50%',
                  width: '50%',
                  backgroundColor: 'black',
                  borderRadius: '50%',
                }, 
                  blackb
                ]}></Animated.View>
              </Animated.View>
            </>
          ))}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default CharacterAnimation;