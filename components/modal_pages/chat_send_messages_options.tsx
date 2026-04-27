import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image02Icon, MicIcon, SettingsIcon, VideoIcon, ImagesIcon, CallAdd02Icon, AudioWave01Icon, Mic02Icon, AddCircleIcon, SmileIcon, SentIcon, Check01Icon, VideosIcon, FileIcon, PlayIcon, LocationIcon, UserIcon, File2Icon, CameraIcon } from '@hugeicons/core-free-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import haptics from '@/hooks/haptics'

const MessagesOptions = ({onClose}) => {
  
  const scale = useSharedValue(0.8)
  const { handleViber } = haptics()
  
  React.useEffect(() => {
    //handleViber.Strong()
    scale.value = withTiming(1, { duration: 120 })
  }, [])
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))
  
  const options = [
    {
      label: 'Media',
      icon: <HugeiconsIcon color='white'  icon={Image02Icon}/>,
      onPress: () => onClose('media_pick')
    },
    {
      label: 'Camera',
      icon: <HugeiconsIcon color='white'  icon={CameraIcon}/>
    },
    {
      label: 'GIFs & Stickers',
      icon: <HugeiconsIcon color='white'  icon={SmileIcon}/>
    },
    {
      label: 'Attachment',
      icon: <HugeiconsIcon color='white'  icon={FileIcon}/>
    },
    {
      label: 'Contact',
      icon: <HugeiconsIcon color='white'  icon={UserIcon}/>
    },
    {
      label: 'Location',
      icon: <HugeiconsIcon color='white'  icon={LocationIcon}/>
    },
  ]
  
  return (
    <Modal transparent animationType='fade' onRequestClose={() => {
      onClose()
    }}>
      <TouchableWithoutFeedback style={{
        flex: 1,
      }} onPress={() => {
        onClose()
      }}>
        <View style={{
          //backgroundColor: 'rgba(0, 0, 0, 0.3)',
          flex: 1,
        }}>
          <Animated.View style={[styles.container, animatedStyle]}>
            {options.map(({label, icon, onPress}, i) => (
              <TouchableOpacity onPress={onPress || null} underlayColor={'#262626'} key={i} style={{
                flexDirection: 'row',
                width: 145,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                }}>{label}</Text>
                {icon}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#161616',
    position: 'absolute',
    bottom: 60,
    left: 5,
    padding: 18,
    paddingHorizontal: 20,
    gap: 25
  },
});

export default MessagesOptions;