import Image from '../../../../components/reusables/Image';
import Button from '../../../../components/reusables/button';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/header'
import userContext from '@/hooks/useUser'
import DotsButton from '@/components/reusables/dots'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { router, withLayoutContext, useLocalSearchParams } from 'expo-router'
import { Star, Globe, UserPlus, Ellipsis } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, ThumbsUpIcon, SentIcon, Comment03Icon, RepostIcon, RepeatIcon, Bookmark02Icon, LocationIcon, EditIcon, LinkForwardIcon, Calendar02Icon, GlobeIcon, UserAdd02Icon, AddIcon } from '@hugeicons/core-free-icons';
import { getDb } from '@/storage/db'
import trans from '@/hooks/fetch'
import dateFormat from '@/utils/day'
import { v4 as uuidv4 } from 'uuid'

const { Navigator } = createStackNavigator()
const Stack = withLayoutContext(Navigator)
const horizontalPadding = 15

const OtherUsersProfile = () => {
  const { user: logged_user } = userContext()
  const [user, setUser] = useState<any | null>({})
  const { user: userFromParams } = useLocalSearchParams()
  const { id: user_id, avatar, name, username } = JSON.parse<any>(userFromParams)
  const [chat, setChat] = useState<any | null>({})
  
  /*const status_colors = [
    '#6a69fe', //Zenith
    '#3ab3fd', //Nexus
    '#bf3afd', //Spark
    '#593afd', //Aura
  ]
  const [color, setColor] = useState(status_colors[0])*/
  
  useEffect(() => {
    (async () => {
      const db = await getDb()
      const getChat = await db.getFirstAsync(`
        SELECT 
          cm.chat_id,
          u.name AS recipient_name,  
          u.avatar AS chat_avatar,  
          u.user_id AS recipient_id
        FROM 
          chat_members cm
        JOIN users u
          ON u.user_id = cm.user_id
        WHERE 
          cm.user_id = ?`, 
        [user_id])
      setChat(getChat)
      console.log(getChat)
    })()
  }, [])
  
  const Tags = [
    'Animes',
    'Coding',
    'Games',
    'Sport',
    'Make friends'
  ]
  
  useEffect(() => {
    (async () => {
      const { data, code } = await trans(`/api/_/get_user_profile?user_id=${user_id}`, {
        useToken: true,
        method: 'GET',
        errorLog: false
      })
      console.log(data);
      setUser(data)
    })()
  }, [])
  
  /*const profile_status = [
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
  ]*/
  
  const redirectToChatPage = (chat) => {
    router.push({
      pathname: '/pages/chat',
      params: {
        chat_id: chat?.chat_id,
        chat_type: chat?.type,
        avatar: chat?.chat_avatar,
        name: chat?.recipient_name,
        recipient_id: chat?.recipient_id
      }
    })
  }
  
  return (
    <View
      style={styles.container}>
      {/*<PageStack/>*/}
      <PageHeader user={username || user?.username}/>
      <View style={{
        //gap: 5,
        marginTop: 10,
        paddingHorizontal: horizontalPadding,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        gap: 2
      }}>
        <Image src={avatar || user?.avatar} size={100}/>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
        }}>
          {name || user?.name}
        </Text>
        <Text style={{
          fontSize: 14,
          //fontWeight: 'bold',
          color: 'darkgrey',
        }}>
          {username || user?.username}
        </Text>
        <Text style={{
          color: 'white',
          display: user?.intro ? undefined : 'none',
          fontSize: 15,
          textAlign: 'center',
        }}>{user?.intro || 'Just exploring quonvers and tryna make new friends... 💜💚'}</Text>
      </View>
      {/*<CountryAndPresence joined={user?.joined_at}/>
      <Buttons color={color} chat={chat}/>
      */}
      {/*Tags tab*/}
      
      
      <View style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        //padding: 15,
        paddingVertical: 5,
        gap: 5
      }}>
        <Button
          viber
          onPress={() => {
            if(!chat?.chat_id) return
            redirectToChatPage(chat)
          }}
          titleStyle={{
            fontWeight: 'bold',
            color: chat?.chat_id ? '#6a69fe' : 'white',
          }}
          style={{ 
            width: 150, 
            height: 45, 
            backgroundColor: chat?.chat_id ? '#6a69fe28' : '#6a69fe',
          }} title={chat?.chat_id ? 'Chat' : 'Request chat'}/>
        <Button 
          viber
          style={{ 
            width: 45,
            height: 45,
            //paddingHorizontal: 15,
            backgroundColor: '#2626267e', 
          }} icon={
            <Ellipsis size={20} color={'white'}/>
          }/>
      </View>
      
      
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

const PageHeader = ({user}) => {
  return (
    <Header titleStyle={{
      fontSize: 18,
    }} isBack title={user}/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
});

export default OtherUsersProfile;