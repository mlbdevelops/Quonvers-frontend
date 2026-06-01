import React, { useEffect } from "react";
import { View, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const profiles = [
  require("../../assets/onboarding/floating/1.jpg"),
  require("../../assets/onboarding/floating/2.jpg"),
  require("../../assets/onboarding/floating/3.jpg"),
  require("../../assets/onboarding/floating/4.jpg"),
  require("../../assets/onboarding/floating/5.jpg"),
  require("../../assets/onboarding/floating/9.jpg"),
  require("../../assets/onboarding/floating/6.jpg"),
  require("../../assets/onboarding/floating/7.jpg"),
  require("../../assets/onboarding/floating/8.jpg"),
];

export default function FloatingProfiles() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1000, {
        duration: 30000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Image style={{
        height: 100,
        width: 100,
        position: 'absolute',
      }} source={require('../../assets/images/splash.png')}/>
      <View
        style={{
          width: 320,
          height: 320,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {profiles.map((avatar, index) => (
          <OrbitAvatar
            key={index}
            avatar={avatar}
            index={index}
            total={profiles.length}
            rotation={rotation}
          />
        ))}
      </View>
    </View>
  );
}

function OrbitAvatar({ avatar, index, total, rotation }) {
  const radius = 120;
  const animatedStyle = useAnimatedStyle(() => {
    const angle =
      ((index / total) * Math.PI * 2) +
      (rotation.value * Math.PI) / 180;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      transform: [
        { translateX: x },
        { translateY: y },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 58,
          height: 58,
          borderRadius: 999,
          overflow: "hidden",
          backgroundColor: "#222",
        },
        animatedStyle,
      ]}
    >
      <Image
        source={avatar}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: '#ffffff28',
        }}
      />
    </Animated.View>
  );
}