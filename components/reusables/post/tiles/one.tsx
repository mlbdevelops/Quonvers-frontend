import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const One = () => {
  const size = width / 2
  
  return (
    <View style={{
      width: size,
      height: size + 15,
      backgroundColor: '#1d1d1d',
      borderRadius: 20,
      marginTop: 10,
    }}>
    </View>
  );
};

export default One;