import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const FadeInView = ({
  children,
  duration = 1000,
  style,
  startingOpacity = 0,
  endingOpacity = 1,
}) => {
  const opacity = useSharedValue(startingOpacity);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(endingOpacity, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;