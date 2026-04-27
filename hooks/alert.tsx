import React, { createContext, useContext, useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import haptics from '@/hooks/haptics'

type Button = { text: string; onPress?: () => void };

type AlertData = {
  visible: boolean;
  title?: string;
  message?: string | React.ReactNode;
  buttons?: Button[];
};

const AlertContext = createContext<(title: string, message: string | React.ReactNode, buttons?: Button[]) => void>(
  () => {}
);

export const useCustomAlert = () => useContext(AlertContext);

export const CustomAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertData>({ visible: false, buttons: [] });

  const showAlert = (title: string, message: string | React.ReactNode, buttons: Button[] = [{ text: "OK" }]) => {
    setAlert({ visible: true, title, message, buttons });
    opacityValueChange(1)
  };
  
  const { handleViber } = haptics()
  const scale = useSharedValue(0.8)
  
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }))
    opacityValueChange(0)
    setTimeout(() => scale.value = .8, 50);
  }
  
  useEffect(() => {
    if (alert.visible) {
      scale.value = withTiming(1, { duration: 100 })
    }
  }, [alert])
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))
  
  const opacityValue = useSharedValue(0)
  
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }))
  
  const opacityValueChange = (toValue = 1) => {
    opacityValue.value = withTiming(toValue, { duration: 120})
  }

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Modal onRequestClose={closeAlert} transparent animationType="fade" visible={alert.visible}>
        <TouchableWithoutFeedback style={{flex: 1}}>
          
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.7)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={[{
                width: "85%",
                backgroundColor: "#171717",
                borderRadius: 25,
                padding: 23,
                paddingVertical: 19,
              }, animatedStyle, opacityStyle]}
            >
              {alert.title && (
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: 'white' }}>
                  {alert.title}
                </Text>
              )}
              
              <Text style={{ fontSize: 15, marginBottom: 20, color: 'white', whiteSpace: 'pre-line' }}>
                {alert.message}
              </Text>
              
              <View style={{ flexDirection: "row", gap: 30, width: '100%', justifyContent: 'flex-end', paddingBottom: 3.5, paddingRight: 8.5, }}>
                {alert.buttons?.map((btn, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      btn.onPress?.();
                      closeAlert();
                      handleViber.Light()
                    }}
                  >
                    <Text style={{ 
                      fontSize: 15, 
                      color: btn?.primary ? '#6a69fe' : btn.style == 'destructive' ? 'tomato' : 'white'
                    }}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AlertContext.Provider>
  );
};