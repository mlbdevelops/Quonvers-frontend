import React from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import Header from '@/components/header'
import { router } from 'expo-router'
import { AuthContext } from '@/utils/authContext'
import { useContext } from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, MenuIcon, UserCircleIcon } from '@hugeicons/core-free-icons';
import Snap from '@/components/reusables/snap'
import TodayComp from '@/components/reusables/todayComp'

const Profile = () => {
  const authContext = useContext(AuthContext)
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#0a0a0a',
      
    }}>
      <Header title='Today' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 16
        }}>
          <TouchableOpacity>
            <HugeiconsIcon color='white' icon={UserCircleIcon} strokeWidth={1.8}/>
          </TouchableOpacity>
        </View>
      }/>
      
      <ScrollView style={{
        width: '100%',
        padding: 5,
      }}>
        <ScrollView horizontal style={{
          flexDirection: 'row',
          width: '100%',
          //alignItems: 'center',
          //justifyContent: 'center',
          paddingBottom: 10,
          marginBottom: 30,
          //borderWidth: 1,
          //borderColor: 'red',
          gap: 10
        }}>
          <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
          }}>
            <Snap />
            <Snap />
            <Snap />
            <Snap />
            <Snap />
          </View>
        </ScrollView>
        <View style={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10
        }}>
          <TodayComp/>
          <TodayComp/>
          <TodayComp/>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;