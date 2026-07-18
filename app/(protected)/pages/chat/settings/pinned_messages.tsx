import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/header'

const PinnedMessages = () => {
  return (
    <View style={styles.container}>
      <Header title={'Pinned messages'} styleType={'chat_settings'} isBack/>
      <Text>PinnedMessages</Text>
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

export default PinnedMessages;