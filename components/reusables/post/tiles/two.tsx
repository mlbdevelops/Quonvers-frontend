import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const Two = () => {
  const size = width / 3
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3.5
    }}>
      <View style={{
        width: size,
        height: size,
        backgroundColor: '#1d1d1d',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        marginTop: 10,
      }}>
      </View>
      <View style={{
        width: size,
        height: size,
        backgroundColor: '#1d1d1d',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 10,
      }}>
      </View>
    </View>
  );
};

export default Two;