import { View, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'

export default function GlassView({ children, viewStyle }) {
  return (
    <View style={{
      ...styles.wrapper,
      ...viewStyle
    }}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
})