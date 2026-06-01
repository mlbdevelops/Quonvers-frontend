import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, ThumbsUpIcon, SentIcon, Comment03Icon, RepostIcon, RepeatIcon, Bookmark02Icon, LocationIcon } from '@hugeicons/core-free-icons';
import Image from '@/components/reusables/Image';

const Repost = ({post}) => {
  return (
    <View style={{
      width: '100%',
      minHeight: 125,
      backgroundColor: '#1d1d1d90',
      padding: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#1d1d1d',
      marginTop: 10,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 3,
      }}>
        <Image avatar bg={'#ffffff28'} size={20}/>
        <Text style={{color: 'white'}}>{post.user}</Text>
        <Text style={{color: 'darkgrey', fontSize: 12,}}>10/03/2026</Text>
      </View>
      <Text numberOfLines={3} style={{
        color: 'white',
      }}>Hey, i would like to tell someone something but i feel damn shy, 😭😭 can someone be my interpreter plzz, i'm even ready to pay for it 👀👀</Text>
      <View style={{
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginTop: 8,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5
        }}>
          <HugeiconsIcon size={18} icon={FavouriteIcon} color='white'/>
          <Text style={{
            color: 'white',
            fontSize: 12,
          }}>26</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5
        }}>
          <HugeiconsIcon size={18} icon={Comment03Icon} color='white'/>
          <Text style={{
            color: 'white',
            fontSize: 12,
          }}>3</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5
        }}>
          <HugeiconsIcon size={18} icon={SentIcon} color='white'/>
          <Text style={{
            color: 'white',
            fontSize: 12,
          }}>58</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5
        }}>
          <HugeiconsIcon size={18} icon={RepostIcon} color='white'/>
          <Text style={{
            color: 'white',
            fontSize: 12,
          }}>4</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Repost;