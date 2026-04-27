import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Snap = ({large}) => {
  return (
    <TouchableOpacity style={{ 
      height: large? 250 : 140,
      width: large? 165 : 100,
      ...styles.container
    }}>
      
      <View></View>
      
      <View style={styles.user_info}>
        <View style={styles.user_profile}></View>
        <Text style={{
          color: 'white',
          marginLeft: 5,
          fontWeight: 'normal',
        }}>Jane</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 15,
    backgroundColor: '#1d1d1d',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    //marginRight: 10,
    borderWidth: 0,
    borderColor: '#262626',
  },
  user_info:{
    display: 'flex',
    flexDirection: 'row',
  },
  user_profile:{
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: '#474747',
  }
});

export default Snap;