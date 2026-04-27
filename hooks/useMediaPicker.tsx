//import Image from '../components/reusables/Image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, FlatList } from 'react-native';
import * as MediaLibrary from "expo-media-library";  
import TabSwitcher from '@/components/reusables/tabSwitcher'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'

export const UseMediaPicker = ({onClose}) => {
  const [globalLoading, setGlobalLoading] = useState<boolean>(true)
  const [batchLoading, setBatchLoading] = useState<boolean>(false)
  const [media, setMedia] = useState<any[]>([])
  const [batchSize, setBatchSize] = useState(30)
  const [after, setAfter] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [ready, setReady] = useState(false)
  
  const getMedia = async () => {
    try {
      if (!globalLoading) {
        setBatchLoading(false)
      }
      const result = await MediaLibrary.getAssetsAsync({
        mediaType: ["photo"],
        first: batchSize,
        after,
        //sortBy: [["creationTime", true]],
      });
      
      setAfter(result.endCursor);
      setHasNextPage(result.hasNextPage);
      setMedia((prev) => [...prev, ...result.assets])
    } catch (err) {
      console.error(err);
    }finally{
      setGlobalLoading(false)
      console.log('loaded');
    }
  };
  
  useEffect(() => {
    (async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          setGlobalLoading(false);
          return;
        }
        getMedia()
      } catch (err) {
        console.error('Error:', err);
      }
    })()
  }, [])
  
  useEffect(() => {
    setTimeout(() => {
      setReady(true)
    }, 100);
  }, [])
  
  
  return (
    <Modal onRequestClose={onClose} transparent animationType='slide' style={styles.container}>
      <View style={{
        backgroundColor: ready && 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        <View></View>
        <View style={{
          backgroundColor: '#111111',
          width: '100%',
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          height: '90%',
          paddingHorizontal: 13,
        }}>
          <TabSwitcher itemStyle={{
            borderRadius: 15,
          }} style={{
            backgroundColor: '#121212',
            borderRadius: 18,
          }} options={['Photo', 'Video']}/>
          {globalLoading? <ActivityIndicator color='white' size={'small'}/> : null}
          <FlashList 
            data={media}
            style={{
              //flexWrap: 'wrap',
              flexDirection: 'row',
              gap: 1,
              flex: 1,
              //backgroundColor: 'blue',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            numColumns={3}
            containerStyle={{
              alignItems: 'center',
              backgroundColor: 'red',
              justifyContent: 'center',
            }}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <View style={{
                width: 110,
                height: 110,
                marginBottom: 1,
                borderRadius: 10,
              }}>
                <Image style={{
                  borderRadius: 10,
                  flex: 1,
                }} resizeMode='' source={{ uri: item.uri }}/>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
