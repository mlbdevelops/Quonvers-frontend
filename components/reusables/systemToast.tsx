import { subscribe } from "../../utils/toaster/toast.ts"
import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native"

type ToastItem = {
  id: string
  message: string
  duration: number
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const unsubscribe = subscribe((toast) => {
      const opacity = new Animated.Value(0)
      const toastWithAnim = { ...toast, opacity }
      setToasts((prev) => [...prev, toastWithAnim])
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start()
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }).start(() => {
          setToasts((prev) =>
            prev.filter((t) => t.id !== toast.id)
          )
        })
      }, toast.duration)
    })
    return unsubscribe
  }, [])

  return (
    <View style={styles.container} >
      {toasts.map((toast) => (
        <Animated.View
          key={toast.id}
          style={[styles.toast, { opacity: toast.opacity }]}
        >
          <Text style={styles.text}>{toast.message}</Text>
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    top: '50%',
    zIndex: 100000,
    left: 0,
    right: 0,
    alignSelf: 'center',
  },
  toast: {
    backgroundColor: "#1d1d1daa",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: "90%",
  },
  text: {
    color: "white",
    fontSize: 14,
  },
})