import Image from '../Image';
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


const Post = ({post: Post}) => {
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
    const res = trans('/api/post/reactions/_like', {
      useToken: true,
      body: { post_id: post.id }
    })
    
    if (!liked) {
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
      <Image cache='memory' style={{
        height: 35,
        width: 35,
      }} src={Post.author_avatar}/>
      <View style={{
        padding: 10,
        paddingRight: 0,
        paddingTop: 0,
        //borderWidth: 2,
        //borderColor: 'red',
        width: '90%',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          //paddingBottom: 5,
        }}>
          <View style={{
            gap: 5,
            flexDirection: 'row',
            alignItems: 'flex-end',
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
            <Text style={{color: 'darkgray', fontSize: 13, fontWeight: 'normal', marginBottom: .5,}}>{new Date(parseInt(post.created_at)).toLocaleDateString()}</Text>
          </View>
          <Ellipsis size={20} color={'darkgray'}/>
        </View>
        <Text style={{
          color: 'white',
          textAlign: 'left',
          paddingTop: 3,
          whiteSpace: 'pre-line',
          fontSize: 14.5,
        }}>{post.caption}</Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          marginTop: 6,
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
        
        {/*<View style={{
          flexDirection: 'row',
          gap: 10,
          marginTop: 7,
        }}>
          <Image
            src={'https://picsum.photos/200/300'}
            style={{
              height: 140,
              width: 140,
              borderRadius: 12,
            }}
            cache='memory'
          />
          <Image
            src={'https://picsum.photos/200/300'}
            style={{
              height: 140,
              width: 140,
              borderRadius: 12,
            }}
            cache='memory'
          />
        </View>*/}
        
        
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
              await viber()
              like_the_post()
            }}>
              <HugeiconsIcon icon={FavouriteIcon} fill={liked? '#6a69fe' : 'transparent'} color={liked? '#6a69fe' : 'white'} size={20}/>
              {post.visible_counts && like_count? <Text style={{
                color: liked? '#6a69fe' : 'white',
              }}>{like_count}</Text> : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                viber()
                post && router.push({
                  pathname: '/pages/post/main_post',
                  params: {
                    post: JSON.stringify(Post)
                  }
                })
              }
            } style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
              <HugeiconsIcon icon={Comment03Icon} color='white' size={20}/>
              {post.visible_counts? <Text style={{
                color: 'white',
              }}>198</Text> : null }
            </TouchableOpacity>
            <TouchableOpacity onPress={ async () => await viber()} style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
              <HugeiconsIcon icon={SentIcon} color='white' size={20}/>
              { post.visible_counts? <Text style={{
                color: 'white',
              }}>89</Text> : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={ async () => await viber()} style={{
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
            await viber()
            setSaved((prev) => !prev)
          }}>
            {/*<HugeiconsIcon fill={saved? 'white' : 'transparent'} icon={Bookmark02Icon} color='white' size={20}/>*/}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1d1d1d',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    paddingTop: 15,
    paddingRight: 10,
  },
});

export default Post;