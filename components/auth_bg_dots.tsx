import React, { useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function StarsBackground({ count = 45, color }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const size = Math.random() * 2 + 1;
      const duration = Math.random() * 15000 + 10000;
      const x = Math.random() * SCREEN_W;
      const startY = SCREEN_H + Math.random() * 100;
      const opacity = Math.random() * 0.6 + 0.2;
      return { size, duration, x, startY, opacity };
    });
  }, [count]);

  return (
    <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFill}>
      {stars.map((star, i) => (
        <StarDot key={i} {...star} />
      ))}
    </Svg>
  );
}

function StarDot({ size, x, startY, duration, opacity }) {
  const translateY = useSharedValue(startY);
  
  translateY.value = withRepeat(
    withTiming(-50, { duration, easing: Easing.linear }),
    -1,
    false,
    startY
  );

  const animatedProps = useAnimatedProps(() => ({
    cx: x,
    cy: translateY.value,
    r: size,
    opacity,
  }));

  return <AnimatedCircle animatedProps={animatedProps} fill="#fff" />;
}