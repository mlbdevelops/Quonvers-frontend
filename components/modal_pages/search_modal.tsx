import React from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SearchIcon, Mic02Icon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router'

const SearchModal = ({visible = false, onClose}) => {
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <Modal visible={visible} transparent animationType={'fade'}>
      <View style={styles.container}>
        <View style={{
          width: '100%',
          height: 60,
          borderWidth: 0,
          flexDirection: 'row',
          paddingHorizontal: 15,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
          }}>
            <TouchableOpacity onPress={onClose}>
              <ArrowLeft color={'white'}/>
            </TouchableOpacity>
            <TextInput 
              placeholderTextColor={'darkgray'}
              placeholder='Search...'
              autoFocus
              value={searchQuery}
              onTextChange={(val) => setSearchQuery(val)}
              style={{
                borderWidth: 0,
                color: 'white',
                width: '78.5%',
              }}
            />
            <TouchableOpacity onPress={() => {
              if (!searchQuery) {
                return
              }
              router.push({
                pathname: '/(protected)/pages/search',
                params: {
                  value: searchQuery
                }
              })
            }}>
              <HugeiconsIcon color='white' icon={SearchIcon}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});

export default SearchModal;