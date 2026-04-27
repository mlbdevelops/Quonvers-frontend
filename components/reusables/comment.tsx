import Image from './Image';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FavouriteIcon } from '@hugeicons/core-free-icons';
import haptics from '@/hooks/haptics'

const ReplyComp = ({ reply }) => {
  
  
  return (
    <View style={{
      flexDirection: 'row',
      width: '95%',
      gap: 10,
      //borderWidth: 1,
      //borderColor: 'white',
      paddingVertical: 10,
    }}>
      <View> 
        <Image avatar style={{
          height: 30,
          width: 30,
        }} 
        /> 
      </View>
      <View style={{
        gap: 1
      }}>
        <View style={{
          flexDirection: 'row',
          gap: 5,
          alignItems: 'center',
        }}>
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            padding: 0,
          }}>{reply.author_username}</Text>
          <Text style={{
            padding: 0,
            color: 'darkgray',
          }}>3w</Text>
        </View>
        
        
        <Text style={{
          color: 'white',
          maxWidth: '95%',
          //borderWidth: 1,
          //borderColor: 'white',
          //whiteSpace: 'pre-line'
        }}>{reply.replyText}</Text>
        <View style={{
          marginTop: 5,
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
        }}>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5
          }}>
           <HugeiconsIcon strokeWidth={2} icon={FavouriteIcon} color='#d3d3d3' size={15}/>
          </View>
          
          <Text style={{
            fontWeight: 'bold',
            fontSize: 12,
            color: '#d3d3d3',
          }}>Reply</Text>
        </View>
      </View>
    </View>
  );
};

export default ReplyComp;