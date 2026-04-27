  const senderSizeValue = useSharedValue(0)
  const scaleButtonValue = useSharedValue(0)
  
  const quickR_button_scale = useSharedValue(1)
  const quickR_button_size = useSharedValue(40)
  
  const senderButtonStyle = useAnimatedStyle(() => ({
    height: senderSizeValue.value,
    width: senderSizeValue.value,
    transform: [{ scale: scaleButtonValue.value }],
  }))
  
  const quickRButtonStyle = useAnimatedStyle(() => ({
    height: quickR_button_size.value,
    width: quickR_button_size.value,
    transform: [{ scale: quickR_button_scale.value }],
  }))
  
  useEffect(() => {
    if (input) {
      senderSizeValue.value = withTiming(45, { duration: 100 })
      quickR_button_size.value = withTiming(0, { duration: 100 })
      quickR_button_scale.value = withTiming(0, { duration: 100 })
      return scaleButtonValue.value = withTiming(1, { duration: 250 })
    }
    senderSizeValue.value = withTiming(0, { duration: 250 })
    scaleButtonValue.value = withTiming(0, { duration: 250 })
    quickR_button_size.value = withTiming(40, { duration: 100 })
    quickR_button_scale.value = withTiming(1, {duration: 100})
  }, [input])
             
             
             <Animated.View style={[{
              height: 40,
              width: 40,
              borderRadius: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
              quickRButtonStyle
            ]}>
              <Text style={{
                fontSize: 22,
                //height: 0,
                //width: 0,
                //transform: [{ scale: 0 }],
              }}>{quickReaction}</Text>
            </Animated.View>
 
 
 
 
 
 
          <Animated.View style={[
            {
              overflow: 'hidden',
              height: 45,
              width: 45,
            },
            senderButtonStyle
          ]}>
          <Pressable onPress={async() => {
            input && await handleViber.Light()
            input && setinput('')
            input && sendMessage()
          }} style={{
            flex: 1,
            backgroundColor: '#6a69fe',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            paddingTop: input? 2.5 : undefined,
            paddingRight: input? 2.5 : undefined,
          }}>
            <HugeiconsIcon 
              icon={SentIcon} 
              fill={input? 'white' : 'transparent'}
              color={input? '#6a69fe' : 'white'}
              size={input? 27 : 23}
            /> 
          </Pressable>
        </Animated.View>