import Image from './Image';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { FavouriteIcon, ThumbsUpIcon, SentIcon, Comment03Icon, RepostIcon, RepeatIcon, Bookmark02Icon, LocationIcon } from '@hugeicons/core-free-icons';
import { Heart, MessageCircle, SendHorizontal, Repeat, Ellipsis } from 'lucide-react-native'
import haptics from '@/hooks/haptics'
import trans from '@/hooks/fetch'
import dateFormat from '../../utils/day.ts'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'


const PostPreview = ({post: Post}) => {
  const { handleViber } = haptics()
  const [post, setPost] = useState<null | any>({})
  const [liked, setLiked] = useState(Post.has_liked || false)
  const [saved, setSaved] = useState(false)
  const [like_count, setLike_count] = useState(parseInt(Post.post_likes_count) || 0)
  
  useEffect(() => {
    setPost(Post)
  }, [Post])
  
  
  const viber = async () => {
    await handleViber.Medium()
  }
  
  const like_the_post = async () => {
    const res = await trans('/api/post/reactions/_like', {
      useToken: true,
      body: { post_id: post.id }
    })
    
    if (res?.res === 'liked') {
      setLiked(true)
      setLike_count((prev) => prev + 1)
    }else{
      setLiked(false)
      setLike_count((prev) => prev && prev - 1)
    }
  }
  
  return (
    <View style={styles.container}>
      {/*<Text>Post</Text>*/}
      <View style={{
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
      }}>
        <Image cache='memory' style={{
          height: 40,
          width: 40,
        }} src={post.author_avatar}/>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          //paddingBottom: 5,
          width: '88%',
        }}>
          <View style={{
            gap: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <View style={{
              flexDirection: 'row',
              gap: 5,
            }}>
              {post.post_surname? <Text 
                style={{
                  //color: 'white',
                  fontWeight: 'bold',
                  fontSize: 15.5,
                  color: '#6a69fe',
                }}>#{post.post_surname}</Text> : null }
              <Text 
                style={{
                  color: post.post_surname? 'darkgray' : 'white',
                  fontWeight: post.post_surname? 'normal' : 'bold',
                  fontSize: 15.5,
                }}>{post.post_surname? '@' : null}{post.author_username}</Text>
            </View>
            <Text style={{color: 'darkgray', fontSize: 11.5, fontWeight: 'normal', marginBottom: .5,}}>{new Date(parseInt(post.created_at)).toLocaleString()}</Text>
          </View>
          
        </View>
      </View>
      <Text 
        style={{
          color: 'white',
          textAlign: 'left',
          paddingVertical: 10,
          whiteSpace: 'pre-line',
          paddingBottom: 8,
          fontSize: 14.5,
        }}>{post.caption}
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 2,
      }}>
        <HugeiconsIcon icon={LocationIcon} color='darkgray' size={13}/>
        <Text style={{
          color: 'darkgray',
          textAlign: 'left',
          fontSize: 13,
          fontWeight: 'bold'
        }}>{post.post_location}</Text>
      </View>
      <View style={{
          flexDirection: 'row',
          gap: 15,
          padding: 7,
          paddingLeft: 0,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View style={{
            flexDirection: 'row',
            gap: post.visible_counts? 20 : 30,
            alignItems: 'center',
            paddingLeft: 0
          }}>
            <TouchableOpacity style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }} onPress={async() => {
              !liked && await viber()
              like_the_post()
            }}>
              <HugeiconsIcon icon={FavouriteIcon} fill={liked? '#6a69fe' : 'transparent'} color={liked? '#6a69fe' : 'white'} size={20}/>
              {post.visible_counts && like_count? <Text style={{
                color: liked? '#6a69fe' : 'white',
              }}>{like_count}</Text> : null}
            </TouchableOpacity>
            <TouchableOpacity style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
              <HugeiconsIcon icon={Comment03Icon} color='white' size={20}/>
              {post.visible_counts? <Text style={{
                color: 'white',
              }}>198</Text> : null }
            </TouchableOpacity>
            <TouchableOpacity style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
              <HugeiconsIcon icon={SentIcon} color='white' size={20}/>
              { post.visible_counts? <Text style={{
                color: 'white',
              }}>89</Text> : null}
            </TouchableOpacity>
            <TouchableOpacity style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
              <HugeiconsIcon icon={RepostIcon} color='white' size={20}/>
              {post.visible_counts? <Text style={{
                color: 'white',
              }}>8</Text> : null}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={async () => {
            !saved && await viber()
            setSaved((prev) => !prev)
          }}>
            {/*<HugeiconsIcon fill={saved? 'white' : 'transparent'} icon={Bookmark02Icon} color='white' size={20}/>*/}
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    //flexDirection: 'row',
    borderWidth: .5,
    borderColor: '#1d1d1d',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 10
  },
});

export default PostPreview;