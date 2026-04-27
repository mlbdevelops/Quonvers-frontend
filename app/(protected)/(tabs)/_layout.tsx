//import Image from '../components/reusables/Image';
import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import React from 'react';
import TabBar from '@/components/bottomBar'
import { ActivityIndicator, View, Text, Pressable, Image } from 'react-native'

export default function TabLayout() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setLoading(false)
  }, [])
  
  if (loading) {
    return(
      <View style={{
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image style={{
          width: 200,
          height: 200,
        }} source={require('../../../assets/images/android-icon-foreground.png')}/>
        {/*<ActivityIndicator size='small' color='white'/>*/}
      </View>
    )
  }
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
      tabBar={props => (<TabBar {...props}/>) }
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarBadge: 2
        }}
      />
      <Tabs.Screen
        name="status"
      />
      <Tabs.Screen
        name="requests"
      />
      <Tabs.Screen
        name="feed"
      />
    </Tabs>
  );

}