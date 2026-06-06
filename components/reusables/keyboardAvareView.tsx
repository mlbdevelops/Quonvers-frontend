import { useAnimatedKeyboard } from "react-native-keyboard-controller";
import Animated from 'react-native-reanimated'

const KeyboardAvareView = () => {
  const { height, progress } = useAnimatedKeyboard();
  return (
    <Animated.View 
      style={[{ height }]}>
    </Animated.View>
  );
}

export default KeyboardAvareView;