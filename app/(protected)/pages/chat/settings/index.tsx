import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router'
import Header from '@/components/header'
import { ArrowLeft, ChevronRight } from 'lucide-react-native'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
  ImageIcon,
  MicIcon,
  SettingsIcon,
  VideoIcon,
  ImagesIcon,
  CallAdd02Icon,
  AudioWave01Icon,
  Mic02Icon, 
  AddCircleIcon,
  SmileIcon,
  SentIcon,
  Check01Icon,
  UserBlock01Icon, 
  ColorsIcon, 
  PaintBoardIcon, 
  LockIcon, 
  UserEdit01Icon, 
  UserRemove01Icon,
  UserGroupIcon,
  CheckmarkCircle02Icon,
  PinIcon,
  Share08Icon,
  Album02Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  ViewIcon,
  ViewOffIcon,
  LinkForwardIcon,
  InLoveIcon,
  AlertIcon,
  Delete02Icon,
  CopyIcon
} from '@hugeicons/core-free-icons';

const Settings = () => {
  
  const options = [
    {
      label: 'Customization', 
      items: [
        { 
          label: "Theme",
          icon: <HugeiconsIcon color='white' icon={ColorsIcon}/>,
        },
        { 
          label: "Nicknames",
          icon: <HugeiconsIcon color='white' icon={UserEdit01Icon}/>,
          action: () => setNicknamesPopUp(true)
        },
        { 
          label: "Quick reaction",
          icon: <HugeiconsIcon color='white' icon={SmileIcon}/>,
          action: () => setquickR(true)
        },
        
      ]
    },
    
    {
      label: 'Privacy', 
      items: [
        { 
          label: "Disappearing message",
          icon: <HugeiconsIcon color='white' icon={Clock01Icon}/>,
        },
        { 
          label: "Muted words",
          icon: <HugeiconsIcon color='white' icon={FilterHorizontalIcon}/>,
        },
        { 
          label: "Allow message forwarding",
          icon: <HugeiconsIcon color='white' icon={LinkForwardIcon}/>,
        },
        { 
          label: "Allow message copying",
          icon: <HugeiconsIcon color='white' icon={CopyIcon}/>,
        },
        { 
          label: "Read receipts", 
          icon: <HugeiconsIcon color='white' icon={ViewIcon}/>, 
        },
      ]
    },
    
    {
      label: 'More actions', 
      items: [
        { 
          label: "View shared media files",
          icon: <HugeiconsIcon color='white' icon={Album02Icon}/>, 
        },
        { 
          label: "Pinned messages",
          icon: <HugeiconsIcon color='white' icon={PinIcon}/>, 
        },
        { 
          label: "Share contact",
          icon: <HugeiconsIcon color='white' icon={Share08Icon}/>,
        },
        { 
          label: "Create a group chat",
          icon: <HugeiconsIcon color='white' icon={UserGroupIcon}/>,
        },
        { 
          label: "Report",
          icon: <HugeiconsIcon color='white' icon={AlertIcon}/>,
        },
        { 
          label: "Delete conversation",
          icon: <HugeiconsIcon color='tomato' icon={Delete02Icon}/>,
          danger: true 
        }
      ]
    },
  ]
  
  const line_actions = [
    {
      label: 'Audio call',
      icon: <HugeiconsIcon size={20} color='white' icon={CallAdd02Icon}/>,
    },
    {
      label: 'Video call',
      icon: <HugeiconsIcon size={20} color='white' icon={VideoIcon}/>,
    },
    {
      label: 'Report',
      icon: <HugeiconsIcon size={20} color='white' icon={AlertIcon}/>,
    },
    {
      label: 'Block',
      icon: <HugeiconsIcon size={20} color='tomato' icon={UserBlock01Icon}/>,
      danger: true
    },
  ]
  
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true
        }}
      />
      <Header headerLeft={
        <View style={{
          gap: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color='white' />
          </TouchableOpacity>
          <Text style={{
            color: 'white',
            fontSize: 18,
          }}>Settings</Text>
        </View>
      }/>
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 60,
      }}>
        <View style={{
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          gap: 5,
          marginTop: 15,
        }}>
          <View style={{
            height: 100,
            width: 100,
            borderRadius: 100,
            backgroundColor: '#262626',
          }}></View>
          <View style={{
            gap: 5,
            alignItems: 'center',
          }}>
            <Text style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 5,
            }}>John Doe</Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          width: '100%',
          marginVertical: 25,
        }}>
          {line_actions.map(({label, icon, danger}, i) => (
            <TouchableOpacity key={i} style={{
              alignItems: 'center',
              gap: 5,
              //borderWidth: 2,
              //borderColor: 'red',
              width: 80,
            }}>
              <View style={{
                height: 40,
                width: 40,
                backgroundColor: danger? '#ff63471d' : '#1d1d1d',
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {icon}
              </View>
              <Text style={{
                color: danger? 'tomato' : 'white',
              }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{
          width: '100%',
        }}>
          {
            options.map(({label, items} , i) => (
              <View key={i} style={{
                gap: 5,
                marginBottom: 15,
              }}>
                <Text style={{
                  color: 'darkgray',
                  marginHorizontal: 5,
                }}>{label}</Text>
                <View>
                  {items.map(({label, icon, danger}, i) => (
                    <TouchableOpacity key={i} style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: 45,
                      padding: 5,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 15,
                      }}>
                        {icon}
                        <Text style={{
                          color: danger? 'tomato' : 'white',
                          fontSize: 15,
                        }}>{label}</Text>
                      </View>
                      <ChevronRight style={{
                        placeSelf: 'flex-end',
                      }} size={15} color='#262626'/>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          }
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 10,
  },
});

export default Settings;