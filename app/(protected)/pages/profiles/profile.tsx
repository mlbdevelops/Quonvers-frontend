import Image from '../../../../components/reusables/Image';
import Button from '../../../../components/reusables/button';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/header'
import userContext from '@/hooks/useUser'
import DotsButton from '@/components/reusables/dots'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { withLayoutContext, useLocalSearchParams } from 'expo-router'
import { Star, Globe } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, ThumbsUpIcon, SentIcon, Comment03Icon, RepostIcon, RepeatIcon, Bookmark02Icon, LocationIcon, EditIcon, LinkForwardIcon, Calendar02Icon, GlobeIcon } from '@hugeicons/core-free-icons';
import { getDb } from '@/storage/db'
import trans from '@/hooks/fetch'

const { Navigator } = createStackNavigator()
const Stack = withLayoutContext(Navigator)
const horizontalPadding = 15

const Profile = () => {
  const { user } = userContext()
  
  const status_colors = [
    '#6a69fe', //Zenith
    '#3ab3fd', //Nexus
    '#bf3afd', //Spark
    '#593afd', //Aura
  ]
  const [color, setColor] = useState(status_colors[0])
  
  const Tags = [
    'Animes',
    'Coding',
    'Games',
    'Sport',
    'Make friends'
  ]
  
  useEffect(() => {
    (async () => {
      const { data, code } = await trans(`/api/_/get_user_profile?user_id=${user.id}`, {
        useToken: true,
        method: 'GET',
        errorLog: false
      })
      console.log(data);
    })()
  }, [])
  
  const profile_status = [
    'Silent',
    'Motion',
    'Nexus', 
    'Spark',
    'Aura',
    'Infinite',
    'Elite',
    'Luminary',
    'Iconic',
    'Zenith'
  ]
  
  return (
    <View
      style={styles.container}>
      <PageStack/>
      <PageHeader user={user}/>
      <View style={{
        //gap: 5,
        marginTop: 10,
        paddingHorizontal: horizontalPadding,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        gap: 5
      }}>
        <Image avatar size={100}/>
        <Text style={{
          fontSize: 25,
          fontWeight: 'bold',
          color: 'white',
        }}>
          {user?.name}
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          marginBottom: 3,
        }}>
          <Text style={{
            fontSize: 15,
            //fontWeight: 'bold',
            color: 'darkgrey',
            textAlign: 'center',
          }}>10k Subscribers</Text>
          {/*<Text style={{
            color: 'darkgrey',
            fontWeight: 'bold',
          }}>•</Text>
          <Text style={{
            color,
            fontSize: 15,
            //fontWeight: 'bold',
          }}>{profile_status[profile_status.length - 1]}</Text>*/}
        </View>
        <Text style={{
          color: 'white',
          textAlign: 'center',
        }}>Don't call, letz meet first 🥇, let's bring the world closer together...</Text>
      </View>
      <CountryAndPresence/>
      <Buttons color={color}/>
      {/*Tags tab*/}
      <View style={{
        paddingHorizontal: horizontalPadding,
        alignItems: 'center',
        justifyContent: 'center',
        //flexDirection: 'row',
      }}>
        <Text style={{color: 'white', marginBottom: 10, fontWeight: 'bold', fontSize: 16,}}>Tags</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {Tags.map((inter, i) => (
              <Text key={i} style={{
                color: 'white' || '#3efffa',
                paddingHorizontal: 15,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#262626' || '#3efffa15',
              }}>{inter}</Text>
            ))}
          </View>
      </View>
      {/*Moments tab*/}
      <View style={{
        width: '100%',
        paddingHorizontal: horizontalPadding,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{color: 'white', marginBottom: 5, fontWeight: 'bold', fontSize: 16, display: 'none',}}>Moments</Text>
      </View>
    </View>
  );
};

const PageStack = () => {
  return(
    <Stack.Screen options={{
      animation: 'fade',
      headerShown: true,
      cardStyleInterpolator: undefined
    }}/>
  )
}

const PageHeader = ({user}) => {
  return (
    <Header titleStyle={{
      fontSize: 18,
    }} isBack title={user?.username} headerRight={
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
      }}>
        {/*<Star 
          fill='#6a69fe'
          color='#6a69fe'
        />*/}
        <DotsButton/>
      </View>
    }/>
  )
}

const Buttons = ({user, color}) => {
  return (
    <View style={{
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      padding: 15,
      paddingVertical: 10,
      gap: 5
    }}>
      <Button
        viber
        titleStyle={{
          fontWeight: 'bold',
          color: '#6a69fe',
        }}
        style={{ 
          width: 150, 
          height: 45, 
          backgroundColor: '#6a69fe28',
        }} title={'Edit profile'}/>
      <Button 
        viber
        style={{ 
          width: 45, 
          height: 45, 
          backgroundColor: '#2626267e', 
        }} icon={
          <HugeiconsIcon size={20} fill='white' icon={LinkForwardIcon} color='white'/>
        }/>
    </View>
  )
}

const CountryAndPresence = () => {
  return(
    <View style={{
      //flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
      gap: 5,
      marginTop: 10,
    }}>
      <View style={{
        color: 'darkgrey',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 3,
        display: 'none',
      }}>
        <Globe
          strokeWidth={1.5}
          color='darkgrey' 
          size={15}
        />
        <Text style={{
          color: 'darkgrey',
        }}>Los Angeles</Text>
      </View>
      <Text style={{
        color: 'darkgrey',
        fontWeight: 'bold',
        display: 'none',
      }}>•</Text>
      <View style={{
        color: 'darkgrey',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 3
      }}>
        <HugeiconsIcon icon={Calendar02Icon} color='darkgrey' size={15}/>
        <Text style={{
          color: 'darkgrey',
        }}>Joined September 28</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
});

export default Profile;