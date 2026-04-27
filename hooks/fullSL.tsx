import React, { createContext, useContext, useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from "react-native";
import haptics from '@/hooks/haptics'

const FullSL = () => {
  
  return (
    <Modal transparent animationType='fade' style={styles.container}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          gap: 15,
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: '#313131',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#202020a7',
          borderRadius: 20,
          height: 50,
          //width: 200,
          padding: 10,
          paddingHorizontal: 20,
        }}>
          <ActivityIndicator color='white' size='small'/>
          <Text style={{
            color: 'white',
            fontSize: 15,
          }}>Please wait...</Text>
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

export default FullSL;