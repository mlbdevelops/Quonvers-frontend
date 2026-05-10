import Image from '../../../components/reusables/Image';
import { View, Text, TouchableOpacity, Button, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FlashList } from '@shopify/flash-list'
import { Image02Icon, MicIcon, SearchIcon, UserCircleIcon, AddCircleIcon, AddIcon, VideoIcon, Notification01Icon, BubbleChatSparkIcon } from '@hugeicons/core-free-icons';
import Header from '@/components/header'
import { router } from 'expo-router'
//import { toast } from 'sonner-native'
import Post from '@/components/reusables/post/post'
import Thought from '@/components/reusables/post/thought'
import { PlusCircle, Ellipsis } from 'lucide-react-native'
import PostSkeleton from '@/components/skeletons/post_skeleton'
import SearchModal from '@/components/modal_pages/search_modal'
import { useState, useEffect, useCallback } from 'react'
import userContext from '@/hooks/useUser'
import haptics from '@/hooks/haptics'
import trans from '@/hooks/fetch'
import { toast } from "@/utils/toaster/toast.ts"
import { Toaster } from '@/components/reusables/systemToast'

export default function feedScreen(){
  const [searchModalOpened, setSearchModalOpened] = useState(false)
  const { user } = userContext()
  const { handleViber } = haptics()
  const [refreshing, setRefreshing] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  
  const get_posts = async () => {
    try {
      setLoading(true)
      const posts = await trans('/api/post/_get', {
        useToken: true,
        method: 'GET',
        errMsg: 'Failed to refresh moments'
      })
      setPosts(posts)
      //console.log(posts);
    } catch (err) {
      toast('Failed to refresh moments')
    } finally {
      setLoading(false)
    }
  }
  
  const onRefresh = useCallback( async () => {
    setRefreshing(true)
    setPosts([])
    await get_posts()
    setRefreshing(false)
  })
  
  
  useEffect(() => {
    get_posts()
  }, [])
  
  
  return(
    <View className='flex-1 bg-[#0a0a0a]'>
      <Toaster position={'bottom'}/>
      <Header title='Moments' headerRightContents={
        <View style={{
          flexDirection: 'row',
          gap: 25,
          alignItems: 'center',
        }}>
          <TouchableOpacity onPress={() => router.push('/(protected)/pages/search')}>
            <HugeiconsIcon color='white' icon={SearchIcon} strokeWidth={1.8}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(protected)/pages/notification')}>
            <HugeiconsIcon color='white' icon={Notification01Icon} strokeWidth={1.8}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/pages/ex2')}>
            <Image avatar style={{
              height: 26,
              width: 26,
            }}/> 
          </TouchableOpacity>
        </View>
      }/>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl progressBackgroundColor='#1d1d1d' colors={['white']}  refreshing={refreshing} onRefresh={onRefresh}/>
        }
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>
        
        <View style={{
          width: '100%',
          height: 40,
          borderRadius: 50,
          backgroundColor: '#1d1d1d',
          flexDirection:'row',
          alignItems: 'center',
          paddingHorizontal: 2.5,
          gap: 10,
          marginTop: 10,
        }}>
          <View style={{
            flexDirection:'row',
            alignItems: 'center',
            gap: 10,
          }}>
            <TouchableOpacity 
              onPress={ async () => {
                await handleViber.Strong()
                router.push({
                  pathname: '/pages/createMoment',
                  params: {
                    open_type: 'select_photo'
                  }
                })
              }}
              style={{
                padding: 7,
                backgroundColor: '#171717',
                borderRadius: 50,
                //borderWidth: .8,
                //borderColor: '#1d1d1d',
              }}>
              <HugeiconsIcon size={20} color='white' icon={Image02Icon}/>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={ async () => {
                await handleViber.Strong()
                router.push({
                  pathname: '/pages/createMoment',
                  params: {
                    open_type: 'record_mic'
                  }
                })
              }}
              style={{
                padding: 7,
                backgroundColor: '#171717',
                borderRadius: 50,
                //borderWidth: .8,
                //borderColor: '#1d1d1d',
              }}>
              <HugeiconsIcon size={20} color='white' icon={MicIcon}/>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={ async () => {
                await handleViber.Strong()
                router.push({
                  pathname: '/pages/createMoment',
                  params: {
                    open_type: 'thought'
                  }
                })
              }}
              style={{
                padding: 7,
                backgroundColor: '#171717',
                borderRadius: 50,
                //borderWidth: .8,
                //borderColor: '#1d1d1d',
              }}>
              <HugeiconsIcon size={20} color='white' icon={BubbleChatSparkIcon}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={ async () => {
            await handleViber.Strong()
            router.push('/pages/createMoment')
          }} activeOpacity={.5} style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: '#171717',
            borderRadius: 50,
            padding: 5,
            justifyContent: 'center',
            //borderWidth: 1,
            //borderColor: '#262626',
          }}>
            <HugeiconsIcon color='white' icon={AddIcon}/>
            <Text style={{
              color: 'white',
            }}>What's new</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{
          paddingTop: 10,
          paddingBottom: 100,
        }}>
          {posts?.length? posts.map((post, i) => (
            <Post isLast={i === posts.length - 1} post={post} key={i}/>
          )) : null}
          
          { loading? 
            <>
              <PostSkeleton/>
              <PostSkeleton/>
              <PostSkeleton/>
              <PostSkeleton/>
              <PostSkeleton/>
              <PostSkeleton/>
              <PostSkeleton/>
              <PostSkeleton/>
              <PostSkeleton/>
            </>
          : null }
          
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