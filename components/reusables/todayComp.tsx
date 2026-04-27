import Image from './Image';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router'

const TodayComp = ({name, type, avatar, background, content}) => {
  return (
    <Pressable onPress={() => router.push('/pages/today_focus')} style={styles.container}>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#262626',
        //borderRadius: 10,
        //marginBottom: 10,
      }}>
        <Text style={{
          color: 'white',
          fontWeight: 'bold',
        }}>{type == 'text'? content : ''}</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
      }}>
        <Image style={{
          height: 25,
          width: 25,
        }} src={avatar}/>
        <Text style={{
          color: 'white',
        }}>{name.split(' ')[0]}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    width: 160,
    borderRadius: 20,
    backgroundColor: '#1d1d1d',
    borderWidth: 0,
    borderColor: '#262626',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
});

export default TodayComp;