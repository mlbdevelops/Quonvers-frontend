import { View, Text, TouchableOpacity, Button, ScrollView, StyleSheet } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ImageIcon, MicIcon, SearchIcon, UserCircleIcon, AddCircleIcon, AddIcon } from '@hugeicons/core-free-icons';
import Header from '@/components/header'
import { router } from 'expo-router'
//import { toast } from 'sonner-native'
import Post from '@/components/reusables/post'
import { PlusCircle } from 'lucide-react-native'
import PostSkeleton from '@/components/skeletons/post_skeleton'
import SearchModal from '@/components/modal_pages/search_modal'
import { useState } from 'react'

export default function feedScreen(){
  const [searchModalOpened, setSearchModalOpened] = useState(false)
  
  return(
    <View className='flex-1 bg-[#0a0a0a]'>
      <Header title='Moments' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 16
        }}>
          <TouchableOpacity onPress={() => router.push('/(protected)/pages/search')}>
            <HugeiconsIcon color='white' icon={SearchIcon} strokeWidth={1.8}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <HugeiconsIcon color='white' icon={UserCircleIcon} strokeWidth={1.8}/>
          </TouchableOpacity>
        </View>
      }/>
      
      {/*<Text className='text-white mb-50'>Timeline</Text>*/}
      
      <ScrollView style={styles.scrollView}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
          <View style={{
            height: 35,
            width: 35,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(106,105,254,0.125)]',
          }}>
            <Text style={{
              color: '#6a69fe',
              fontWeight: 'bold',
            }}>A</Text>
          </View>
          <View style={{
            flex: 1,
            borderRadius: 50,
            backgroundColor: '#1d1d1d',
            height: 35,
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{
              color: 'darkgray',
            }}>Hey, what's new</Text>
            <View style={{
              gap: 15,
              flexDirection: 'row',
              borderRadius: 50,
              backgroundColor: '#0a0a0a',
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              opacity: 0,
            }}>
              <HugeiconsIcon size={20} color='white' icon={ImageIcon}/>
              <HugeiconsIcon size={20} color='white' icon={MicIcon}/>
            </View>
          </View>
        </View>
        <View style={{
          paddingTop: 15,
          paddingBottom: 100,
        }}>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <Post/>
          <PostSkeleton/>
          <PostSkeleton/>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
    paddingTop: 0,
  }
})