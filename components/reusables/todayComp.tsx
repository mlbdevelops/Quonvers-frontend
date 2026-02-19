import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router'
const TodayComp = () => {
  return (
    <Pressable onPress={() => router.push('/pages/today_focus')} style={styles.container}>
      <Text style={{
        color: 'white',
      }}>TodayComp</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    width: '98.5%',
    borderRadius: 20,
    backgroundColor: '#1d1d1d',
    borderWidth: 1,
    borderColor: '#262626',
    
  },
});

export default TodayComp;