//import Image from '../../Image';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
const { width } = Dimensions.get('window');

const Three = () => {
  const size = width / 3.86
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3.5
    }}>
      <Image source={require('../../../../assets/test/0f1f466acf57092090963a0f4cb1627a.jpg')} style={{
        width: size,
        height: size,
        backgroundColor: '#1d1d1d',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        marginTop: 10,
      }}/>
      <Image source={require('../../../../assets/test/a53f4a853f8094c80ff7ca3a9c25356f.jpg')} style={{
        width: size,
        height: size,
        backgroundColor: '#1d1d1d',
        marginTop: 10,
      }}/>
      <Image source={require('../../../../assets/test/test1.jpg')} style={{
        width: size,
        height: size,
        backgroundColor: '#1d1d1d',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 10,
      }}/>
    </View>
  );
};

export default Three;