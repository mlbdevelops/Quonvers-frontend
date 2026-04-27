import React from 'react';
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import FadeInView from '@/components/reusables/fadeInView' 

const PostSkeleton = () => {
  
  return (
    <FadeInView startingOpacity={.1} style={styles.container}>
      {/*<Text>Post</Text>*/}
      <View style={{
      }}>
        <View style={{
          height: 35,
          width: 35,
          backgroundColor: '#262626',
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}></View>
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
          marginBottom: 5,
        }}>
          <View style={{
            width: 110,
            backgroundColor: '#262626',
            borderRadius: 50,
            height: 10,
          }}></View>
        </View>
        
        <View style={{
          gap: 6
        }}>
          <View style={{
            height: 10,
            backgroundColor: '#262626',
            borderRadius: 50,
            width: 230,
          }}></View>
          <View style={{
            height: 10,
            backgroundColor: '#262626',
            borderRadius: 50,
            width: 200,
          }}></View>
          <View style={{
            height: 10,
            backgroundColor: '#262626',
            borderRadius: 50,
            width: 250,
          }}></View>
        </View>
      </View>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    paddingTop: 15
  },
});

export default PostSkeleton;