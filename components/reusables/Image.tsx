//import Image from '';
import React from 'react';
import { StyleSheet } from 'react-native';
import userContext from '@/hooks/useUser'
import { Image as Img } from 'expo-image'

type ImageProps = {
  src: string
  style: object
  cache: 'memory' | 'none' | 'disk' | 'memory-disk' | 'immutable'
  avatar: boolean,
  size: number,
  bg: string | null
}

const Image = ({src, style, cache, avatar = false, size = 10, bg = null}: ImageProps) => {
  const { user } = userContext()
  return (
    <>
      <Img 
        source={
          avatar? (
            user?.avatar? { 
              uri: user?.avatar
            }
            : 
            require('../../assets/images/no_profile.png')
          )
          :
          (
            src? { 
              uri: src
            } 
            : require('../../assets/images/no_profile.png')
          )
        } 
        cachePolicy={avatar? 'memory-disk' : cache}
        style={{
          ...styles.image,
          height: size,
          width: size,
          backgroundColor: bg || styles.image.backgroundColor,
          ...style,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 1000,
    backgroundColor: '#1d1d1d',
  },
});

export default Image;