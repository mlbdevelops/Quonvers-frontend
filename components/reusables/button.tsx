import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useKeyboard } from '@/hooks/keyboard';
import haptics from '@/hooks/haptics'

const Button = ({
  title,
  loading,
  stopLoad,
  loading_msg,
  style,
  onPress,
  hideOnKeyboardShown,
  viber,
  icon,
  iconPosition = 'left',
  titleStyle
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isKeyboardOpen } = useKeyboard()
  const { handleViber } = haptics()
  
  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    }else{
      setIsLoading(false)
    }
  }, [loading]);
  
  useEffect(() => {
    if (stopLoad) {
      setIsLoading(false);
    }
  }, [stopLoad]);

  const handlePress = () => {
    if (isLoading) return;
    viber && handleViber.Strong()
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={.5}
      style={{
        width: '100%',
        display: hideOnKeyboardShown && isKeyboardOpen && 'none',
        height: 45,
        borderRadius: 50,
        backgroundColor: '#6a69fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        opacity: isLoading ? .5 : 1,
        flexDirection: 'row',
        gap: 5,
        ...style,
      }}
    >
      {icon && iconPosition == 'left' && icon}
      {!isLoading && (title && <Text style={{ color: style?.color || 'white', ...titleStyle }}>{title}</Text>)}
      {isLoading && <ActivityIndicator size="small" color="white" />}
      {isLoading && loading_msg && (
        <Text style={{ color: 'white' }}>{loading_msg}</Text>
      )}
      {icon && iconPosition == 'right' && icon}
    </TouchableOpacity>
  );
};

export default Button;