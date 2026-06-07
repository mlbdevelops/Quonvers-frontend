import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider } from '@react-native-community/slider'

const Slider = ({onSlide}) => {
  return (
    <View style={styles.container}>
      <Slider
        style={{
          width: '80%',
          //backgroundColor: '#fe6969',
          padding: 0,
          borderRadius: 500,
          height: 10,
        }}
        minimumTrackTintColor="#6a69fe"
        maximumTrackTintColor="#6a69fe"
        thumbTintColor="white"
        value={0.3}
        maximumValue={1}
        minimumValue={0.0}
        onValueChange={(val) => typeof onSlide() == 'function' && onSlide(val);}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Slider;