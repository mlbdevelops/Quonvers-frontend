import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ImageIcon, MicIcon, SearchIcon, UserCircleIcon, AddCircleIcon, AddIcon, FavouriteIcon, Comment03Icon, SentIcon } from '@hugeicons/core-free-icons';

const TodayFocus = () => {
  const [hasLiked, sethasLiked] = React.useState(false)
  return (
    <View style={styles.container}>
      <Pressable
        onDoublePress={() => sethasLiked((prev) => !prev)}
        style={{
          height: '93.5%',
          width: '100%',
          //flex: 1,
          backgroundColor: '#1d1d1d94',
          borderRadius: 20,
        }}
      ></Pressable>
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: '#1d1d1d43',
        borderRadius: 50,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10
        }}>
          <TouchableOpacity onPress={() => sethasLiked((prev) => !prev)} style={{
            height: 40,
            width: 40,
            backgroundColor:'#1d1d1da8',
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#1d1d1d',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HugeiconsIcon 
              icon={FavouriteIcon}
              fill={hasLiked? '#6a69fe' : 'transparent'}
              color={hasLiked? '#6a69fe' : 'white'}
            />
          </TouchableOpacity>
          <View style={{
            backgroundColor: '#1d1d1d',
            //width: '85%',
            height: 35,
            borderRadius: 50,
            padding: 5,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{color: 'darkgray'}}>Reply...</Text>
          </View>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
});

export default TodayFocus;