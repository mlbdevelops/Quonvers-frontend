import Image from '../../../components/reusables/Image';
import React from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, FlatList } from 'react-native';
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
  const [list, setlist] = React.useState([
    {
      id: 1,
      type: 'text',
      content: 'A new day begins 🎉',
      avatar: '',
      background: '',
      name: 'Caroline Hernandez'
    },
    {
      id: 2,
      type: 'text',
      content: 'Damn tired today',
      avatar: '',
      background: '',
      name: 'Anais Watterson'
    },
    {
      id: 3,
      type: 'text',
      content: 'Hell',
      avatar: '',
      background: '',
      name: 'Carissa Rochelle'
    },
    {
      id: 4,
      type: 'text',
      content: 'Hate you',
      avatar: '',
      background: '',
      name: 'Adamentia Wells'
    },
    {
      id: 5,
      type: 'text',
      content: 'Helllllo',
      avatar: '',
      background: '',
      name: 'Anson George'
    },
    {
      id: 6,
      type: 'text',
      content: 'Gonna party today, wanna come',
      avatar: '',
      background: '',
      name: 'Habiba Gabrielle'
    },
  ])
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#0a0a0a',
      //paddingBottom: 20,
    }}>
      <Header title='Status' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 25,
          alignItems: 'center',
        }}>
          <TouchableOpacity>
            <Image avatar style={{
              height: 26,
              width: 26,
            }}/> 
          </TouchableOpacity>
        </View>
      }/>
      
      <FlatList
        data={list}
        numColumns={2}
        style={{
          padding: 5,
          flex: 1,
          //backgroundColor: 'blue',
        }}
        contentContainerStyle={{
          //backgroundColor: 'red',
          paddingBottom: 20,
          //backgroundColor: 'red',
          //justifyContent: 'space-between',
          //alignItems: 'center',
          gap: 5,
          flex: 1,
        }}
        keyExtractor={(i) => i.id}
        columnWrapperStyle={{
          justifyContent: 'space-around',
          marginBottom: 8.5,
        }}
        renderItem={({item}) => (
          <TodayComp 
            type={item.type}
            name={item.name}
            content={item.content}
            avatar={item.avatar}
          />
        )}
      />
    </View>
  );
};

export default Profile;