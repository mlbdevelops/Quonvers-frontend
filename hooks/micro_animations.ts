import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'

export const scale = (finalValue = 0) => {
  const scale = useSharedValue(1)
  scale.value = withTiming(0, { duration: 1000 })
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))
  
  return animatedStyle
}

