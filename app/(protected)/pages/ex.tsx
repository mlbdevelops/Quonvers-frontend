import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function GestureExamplePage() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      //translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      //translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        //{ translateX: translateX.value },
        { translateY: translateY.value },
        {
          rotate: `${translateX.value / 10}deg`,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drag The Card</Text>
      <View style={{
        height: 500,
        width: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <GestureDetector style={{
        padding: 20,
      }} gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.cardText}>🔥 Quonvers</Text>
        </Animated.View>
      </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    position: 'absolute',
    top: 80,
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },

  card: {
    width: width / 3,
    height: width / 3,
    borderRadius: 28,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  cardText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});