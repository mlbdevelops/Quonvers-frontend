import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import React from 'react';
import TabBar from '@/components/bottomBar'
import { ActivityIndicator, View, Text, Pressable } from 'react-native'

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
        <ActivityIndicator size='large' color='#6a69fe'/>
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
          title: 'Chats'
        }}
      />
      <Tabs.Screen
        name="today"
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
