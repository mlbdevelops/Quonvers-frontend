import React from 'react';
import { Ellipsis } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import haptics from '@/hooks/haptics'

const DotsButton = ({ onPress }) => {
  const { handleViber } = haptics()
  return (
    <TouchableOpacity
      onPress={() => {
        handleViber.Medium()
        typeof onPress == 'function' && onPress()
      }} style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        borderRadius: 50,
        height: 25,
        width: 25,
        borderWidth: 1.5,
        borderColor: 'white',
      }}
    >
      <Ellipsis size={17.5} color='white' />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DotsButton;