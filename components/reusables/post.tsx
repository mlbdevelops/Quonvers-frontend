import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ThumbUpIcon } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, ThumbsUpIcon, SentIcon, Comment03Icon, RepostIcon, RepeatIcon, Bookmark02Icon } from '@hugeicons/core-free-icons';
import { Heart, MessageCircle, SendHorizontal, Repeat, Ellipsis } from 'lucide-react-native'
import haptics from '../../hooks/haptics.js'
import { useState } from 'react'

const Post = () => {
  const { handleViber } = haptics()
  const [liked, setLiked] = useState(false)
  
  return (
    <View style={styles.container}>
      {/*<Text>Post</Text>*/}
      <View style={{
      }}>
        <View style={{
          height: 35,
          width: 35,
          backgroundColor: 'green',
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{color: 'white'}}>M</Text>
        </View>
      </View>
      <View style={{
        padding: 10,
        paddingRight: 0,
        paddingTop: 0,
        //borderWidth: 2,
        //borderColor: 'red',
        width: '90%',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 5,
        }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15,}}>John doe <Text style={{color: 'darkgray', fontSize: 12,}}>10/3/2026</Text> </Text>
          <Ellipsis size={20} color={'darkgray'}/>
        </View>
        <Text style={{color: 'white', textAlign: 'left', paddingTop: 3,}}>Hello brother and I are going to edit the height of the n the height of the n the height to edit the timing of your help today with the height of the n the height of the n the height</Text>
        
        <View style={{
          flexDirection: 'row',
          gap: 10,
          marginTop: 7,
        }}>
          <View
            style={{
              height: 87,
              width: 87,
              borderRadius: 12,
              backgroundColor: '#1d1d1d',
              borderWidth: 1,
              borderColor: '#262626',
            }}
          ></View>
          <View
            style={{
              height: 87,
              width: 87,
              borderRadius: 12,
              backgroundColor: '#1d1d1d',
              borderWidth: 1,
              borderColor: '#262626',
            }}
          ></View>
          <View
            style={{
              height: 87,
              width: 87,
              borderRadius: 12,
              backgroundColor: '#1d1d1d',
              borderWidth: 1,
              borderColor: '#262626',
            }}
          ></View>
        </View>
        
        
        <View style={{
          flexDirection: 'row',
          gap: 15,
          padding: 7,
          paddingLeft: 0,
          //justifyContent: 'space-between',
        }}>
          <TouchableOpacity style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }} onPress={async() => {
            await handleViber.Light()
            setLiked((prev) => !prev)
          }}>
            <HugeiconsIcon icon={FavouriteIcon} fill={liked? '#6a69fe' : 'transparent'} color={liked? '#6a69fe' : 'white'} size={20}/>
            <Text style={{
              color: 'white',
            }}>2.3k</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}>
            <HugeiconsIcon icon={Comment03Icon} color='white' size={20}/>
            <Text style={{
              color: 'white',
            }}>198</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}>
            <HugeiconsIcon icon={SentIcon} color='white' size={20}/>
            <Text style={{
              color: 'white',
            }}>89</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}>
            <HugeiconsIcon icon={RepostIcon} color='white' size={20}/>
            <Text style={{
              color: 'white',
            }}>58</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <HugeiconsIcon icon={Bookmark02Icon} color='white' size={20}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: .5,
    borderColor: '#1d1d1d',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    paddingTop: 15,
    paddingRight: 10,
  },
});

export default Post;