import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const showEvent = "keyboardDidShow";
    const hideEvent = "keyboardDidHide";
    
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsOpen(true);
    });
    
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      setIsOpen(false);
    });
    
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {
    isKeyboardOpen: isOpen,
    keyboardHeight,
  };
}