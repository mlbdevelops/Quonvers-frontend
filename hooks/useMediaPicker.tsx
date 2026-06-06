//import Image from '../components/reusables/Image';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, FlatList, Pressable, Dimensions } from 'react-native';
import * as MediaLibrary from "expo-media-library";  
import TabSwitcher from '@/components/reusables/tabSwitcher'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/header'
import { ArrowLeft } from 'lucide-react-native'

const { width, height } = Dimensions.get('window');

export const UseMediaPicker = ({onClose}) => {
  const [globalLoading, setGlobalLoading] = useState<boolean>(true)
  const [batchLoading, setBatchLoading] = useState<boolean>(false)
  const safeInsets = useSafeAreaInsets()
  const [media, setMedia] = useState<any[]>([])
  const [batchSize, setBatchSize] = useState(200)
  const [after, setAfter] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [ready, setReady] = useState(false)
  const [mediaType, setMediaType] = useState('photo')
  const spacing = 5
  
  const getMedia = async () => {
    try {
      if (!globalLoading) {
        setBatchLoading(false)
      }
      const result = await MediaLibrary.getAssetsAsync({
        mediaType: [mediaType],
        first: batchSize,
        after,
        sortBy: [["creationTime", false]],
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
      console.log(safeInsets);
    }, 100);
  }, [])
  
  
  return (
    <Modal onRequestClose={onClose} transparent animationType='slide'>
      <View style={{
        flex: 1,
        backgroundColor: '#111111',
      }}>
        <View></View>
        <View style={{
          paddingHorizontal: 15,
          height: 85,
          flexDirection: 'row',
          gap: 10,
          paddingTop: 30,
          alignItems: 'center',
        }}>
          <Pressable onPress={onClose}>
            <ArrowLeft color='white'/>
          </Pressable>
          <Text style={{
            color: 'white',
            fontWeight: ' bold',
            fontSize: 18,
          }}>Select a media</Text>
        </View>
        <TabSwitcher style={{
          alignSelf: 'center',
          //width: '95%',
          //marginBottom: 10,
        }} options={['Photos', 'Videos']}/>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          display: globalLoading? undefined : 'none',
        }}>
          <ActivityIndicator color='#6a69fe' size='large'/>
        </View>
        <FlashList
          data={media}
          numColumns={3}
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            backgroundColor: 'black',
            justifyContent: 'space-around',
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({item, index: i}) => (
            <View style={{
              height: width / 2,
              width: width / 3.1,
              marginHorizontal: 2,
              marginBottom: 3,
            }}>
              {item.mediaType == 'photo'? <Image source={{uri: item.uri}} style={{
                flex: 1,
              }}/> : null}
            </View>
          )}
        />
      </View>
    </Modal>
  );
};


