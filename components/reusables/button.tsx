import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const Button = ({
  title,
  loading,
  stopLoad,
  loading_msg,
  style,
  onPress
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
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
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={{
        width: '100%',
        height: 45,
        borderRadius: 50,
        backgroundColor: '#6a69fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        opacity: isLoading ? 0.5 : 1,
        flexDirection: 'row',
        gap: 5,
        ...style,
      }}
    >
      {!isLoading && <Text style={{ color: 'white' }}>{title}</Text>}
      {isLoading && <ActivityIndicator size="small" color="white" />}
      {isLoading && loading_msg && (
        <Text style={{ color: 'white' }}>{loading_msg}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;