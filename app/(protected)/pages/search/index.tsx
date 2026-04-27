import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SearchIcon, Mic02Icon } from '@hugeicons/core-free-icons';
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'
import { AuthContext } from '@/utils/authContext'
import { useCustomAlert } from '../../../../hooks/alert.tsx'

const WriterSearch = () => {
  const authContext = React.useContext(AuthContext)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [loaded, setLoaded] = React.useState(false)
  const [searchHistory, setSearchHistory] = React.useState([])
  const alert = useCustomAlert()
  const recent_key = 'recent_search_history'
  
  React.useEffect(() => {
    (async () => {
      try {
        //await AsyncStorage.removeItem(recent_key)
        const recent_data = JSON.parse(await AsyncStorage.getItem(recent_key)) || []
        setSearchHistory(recent_data)
        setLoaded(true)
      } catch (err) {
        toast('Error loading search history.')
      }
    })()
  }, [])
  
  const saveToLocalStorage = async (val) => {
    try {
      if (!val && !searchQuery) {
        return
      }
      setSearchQuery(val)
      const getData = JSON.parse(await AsyncStorage.getItem(recent_key)) || []
      const data = val || searchQuery
      const newData = [
        ...new Set([data, ...getData])
      ].slice(0, 10)
      await AsyncStorage.setItem(recent_key, JSON.stringify(newData))
      setSearchHistory(newData)
      router.push({
        pathname: '/(protected)/pages/search/writerSearch',
        params: {
          value: val || searchQuery
        }
      })
    } catch (error) {
      toast('Error saving search history.')
    }
  }
  
  const deleteFromHistory = async (val) => {
    setSearchHistory((prev) => prev.filter(p => p !== val))
    await AsyncStorage.setItem(recent_key, JSON.stringify(searchHistory.filter(v => v !== val)))
  }
  
  return (
    <View style={styles.container}>
      <Toaster/>
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
          gap: 10,
          width: '100%',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={'white'}/>
          </TouchableOpacity>
          <TextInput 
            placeholderTextColor={'darkgray'}
            placeholder='Search...'
            autoFocus
            value={searchQuery}
            selectionColor='#6a69fe'
            cursorColor='#6a69fe'
            onSubmitEditing={() => {
              saveToLocalStorage()
            }}
            onChangeText={(val) => setSearchQuery(val)}
            style={{
              borderWidth: 0,
              color: 'white',
              flex: 1,
              borderRadius: 50,
              backgroundColor: '#1d1d1d',
              padding: 0,
              paddingVertical: 7,
              paddingHorizontal: 15,
              //height: 35,
              alignItems: 'center',
              flexDirection: 'row',
            }}
          />
          <TouchableOpacity onPress={() => saveToLocalStorage()}>
            <HugeiconsIcon color='white' icon={SearchIcon}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{
        width: '100%',
        gap: 20,
        padding: 15,
      }}>
        {searchHistory && <Text style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 15,
        }}>Recent</Text>}
        {!loaded && <ActivityIndicator color='white' size={'small'}/>}
        {searchHistory.map((val, i) => (
          <TouchableOpacity onPress={() => saveToLocalStorage(val)} key={i} style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
            }}>
              <HugeiconsIcon color='white' icon={SearchIcon} size={20}/>
              <Text style={{
                color: 'white',
              }}>{val.slice(0, 40)}</Text>
            </View>
            
            <TouchableOpacity style={{
              alignSelf: 'flex-end',
            }} onPress={() => {
              alert(null, 'Are you sure delete from search history?', [
                  {
                    text: 'Cancel'
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteFromHistory(val)
                  },
                ])
            }}>
              <X color='darkgray' size={15}/>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});

export default WriterSearch;