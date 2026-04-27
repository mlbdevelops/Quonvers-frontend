import Image from '../Image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, ThumbsUpIcon, SentIcon, Comment03Icon, RepostIcon, RepeatIcon, Bookmark02Icon } from '@hugeicons/core-free-icons';
import { handleViber } from '@/hooks/haptics'
import { Ellipsis } from 'lucide-react-native'
import haptics from '@/hooks/haptics'
import { router } from 'expo-router'

const Thought = ({ thought, preview = false }) => {
  const [liked, setLiked] = useState(false)
  const [like_count, setLike_count] = useState(thought?.like_count || 0)
  const { handleViber } = haptics()
  
  const viber = async () => {
    await handleViber.Medium()
  }
  
  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row',
        width: '100%',
        //backgroundColor: 'white',
      }}>
        
        <View style={{
          height: 13,
          width: 13,
          backgroundColor: '#1d1d1d' || '#2c1e55',
          borderRadius: 50,
          position: 'absolute',
          bottom: -17,
          left: 25,
          //borderWidth: 1,
          borderColor: '#262626',
        }}></View>
        
        <View style={{
          height: 20,
          width: 40,
          //backgroundColor: '#1d1d1d',
          borderRadius: 50,
          
        }}></View>
        
        
        <View style={{
          padding: 13,
          //borderWidth: 1.5,
          borderStyle: 'dashed',
          borderRadius: 20,
          backgroundColor: '#1d1d1d' || '#2c1e55',
          maxWidth: preview? '85%' : '80%',
          zIndex: 1,
          //borderWidth: 1,
          borderColor: '#262626',
        }}>
          <Text style={{
            color: 'white',
          }}>{thought.caption}</Text>
          <View style={{
            height: 20,
            width: 20,
            backgroundColor: '#1d1d1d' || '#2c1e55',
            borderRadius: 50,
            position: 'absolute',
            bottom: -3,
            zIndex: 0,
            left: -3,
            //borderWidth: 1,
            borderStyle: 'dashed',
            //borderWidth: 1,
            borderColor: '#262626',
          }}></View>
        </View>
      </View>
      
      <View style={{
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-end',
      }}>
        <Image src={thought.author_avatar} style={{
          height: 35,
          width: 35,
          borderRadius: 50,
        }}/>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          gap: 6
        }}>
          <View style={{
            gap: 5,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
            <Text 
              style={{
                color: 'white',
                fontWeight : 'bold',
                fontSize: 15.5,
              }}>{thought.author_username}</Text>
            <Text style={{color: 'darkgray', fontSize: 13, fontWeight: 'normal', marginBottom: .5,}}>16h left</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            gap: 15,
            paddingLeft: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{
              flexDirection: 'row',
              gap: thought.visible_counts? 20 : 30,
              alignItems: 'center',
              paddingLeft: 0
            }}>
              <TouchableOpacity style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
              }} onPress={async() => {
                await viber()
                setLike_count((prev) => liked? prev - 1 : prev + 1)
                setLiked((prev) => !prev)
              }}>
                <HugeiconsIcon icon={FavouriteIcon} fill={liked? '#6a69fe' : 'transparent'} color={liked? '#6a69fe' : 'white'} size={20}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                  viber()
                  thought && router.push({
                    pathname: '/pages/post/main_post',
                    params: {
                      post: JSON.stringify(thought)
                    }
                  })
                }
              } style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
              }}>
                <Text style={{
                  color: 'darkgray',
                  fontWeight: 'bold'
                }}>Reply</Text>
              </TouchableOpacity>
              {/*<TouchableOpacity onPress={ async () => await viber()} style={{
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
              }}>
                <HugeiconsIcon icon={SentIcon} color='white' size={20}/>
              </TouchableOpacity>*/}
            </View>
            <TouchableOpacity onPress={async () => {
              await viber()
              
            }}>
              <Ellipsis size={20} color={'darkgray'}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#1d1d1d',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    gap: 10,
    alignItems: 'flex-end',
  }
})

export default Thought;