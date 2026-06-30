import React, { createContext, useContext, useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import haptics from '@/hooks/haptics'

type Button = { text: string; onPress?: () => void };

type OptionListData = {
  visible: boolean;
  title?: string;
  message?: string | React.ReactNode;
  buttons?: Button[];
};

const OptionListContext = createContext<(title: string, message: string | React.ReactNode, buttons?: Button[]) => void>(
  () => {}
);

export const useOptionList = () => useContext(OptionListContext);

export const OptionListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [OptionList, setOptionList] = useState<OptionListData>({ visible: false, buttons: [] });

  const showOptionList = (title: string, message: string | React.ReactNode, buttons: Button[] = [{ text: "OK" }]) => {
    setOptionList({ visible: true, title, message, buttons });
    opacityValueChange(1)
  };
  
  const { handleViber } = haptics()
  const scale = useSharedValue(0.8)
  
  const closeOptionList = () => {
    setOptionList(prev => ({ ...prev, visible: false }))
    opacityValueChange(0)
    setTimeout(() => scale.value = .8, 50);
  }
  
  useEffect(() => {
    if (OptionList.visible) {
      scale.value = withTiming(1, { duration: 100 })
    }
  }, [OptionList])
  
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
    <OptionListContext.Provider value={showOptionList}>
      {children}
      <Modal onRequestClose={closeOptionList} transparent animationType="fade" visible={OptionList.visible}>
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
              {OptionList.title && (
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12, color: 'white' }}>
                  {OptionList.title}
                </Text>
              )}
              
              {OptionList.message && <Text style={{ fontSize: 15, marginBottom: 20, color: 'white', whiteSpace: 'pre-line' }}>
                {OptionList.message}
              </Text>}
              
              <View style={{ gap: 18, width: '100%' }}>
                {OptionList.buttons?.map((btn, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      btn.onPress?.();
                      closeOptionList();
                      handleViber.Light()
                    }}
                    style={{
                      width: '100%',
                      marginTop: btn.type == 'cancel'? undefined : 6,
                      display: typeof btn?.display == 'boolean' && !btn?.display? 'none' : btn?.display? undefined : undefined,
                      alignItems: btn.type == 'cancel' && 'flex-end',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 15,
                      fontWeight: btn.bold && 'bold',
                      margin: btn.type == 'cancel' && 5,
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
    </OptionListContext.Provider>
  );
};