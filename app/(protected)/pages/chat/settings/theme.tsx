import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable, View, Text } from 'react-native';

export default function theme() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={[{ width: 100, height: 100, backgroundColor: 'tomato' }, animatedStyle]} />
      <Pressable onPress={() => (scale.value = withSpring(scale.value === 1 ? 1.5 : 1))}>
        <Text style={{ marginTop: 20, fontSize: 16 }}>Press Me</Text>
      </Pressable>
    </View>
  );
}