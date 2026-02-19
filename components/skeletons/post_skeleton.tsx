import React from 'react';
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

const PostSkeleton = () => {
  
  return (
    <View style={styles.container}>
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
          marginBottom: 15,
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
          <View style={{
            justifyContent: 'space-between',
            width: 130,
            flexDirection: 'row',
            gap: 10,
            marginTop: 5,
          }}>
            <View style={{
              height: 16,
              width: 16,
              backgroundColor: '#262626',
              borderRadius: 50
            }}></View>
            <View style={{
              height: 16,
              width: 16,
              backgroundColor: '#262626',
              borderRadius: 50
            }}></View>
            <View style={{
              height: 16,
              width: 16,
              backgroundColor: '#262626',
              borderRadius: 50
            }}></View>
            <View style={{
              height: 16,
              width: 16,
              backgroundColor: '#262626',
              borderRadius: 50
            }}></View>
          </View>
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
    paddingTop: 15
  },
});

export default PostSkeleton;