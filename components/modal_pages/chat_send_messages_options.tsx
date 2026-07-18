import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image02Icon, MicIcon, SettingsIcon, VideoIcon, ImagesIcon, CallAdd02Icon, AudioWave01Icon, Mic02Icon, AddCircleIcon, SmileIcon, SentIcon, Check01Icon, VideosIcon, FileIcon, PlayIcon, LocationIcon, UserIcon, File2Icon, CameraIcon, LinkIcon } from '@hugeicons/core-free-icons';
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
      icon: <HugeiconsIcon color='white' size={20}  icon={Image02Icon}/>,
      onPress: () => onClose('media_pick')
    },
    {
      label: 'Attachment',
      icon: <HugeiconsIcon color='white' size={20}  icon={LinkIcon}/>
    },
    {
      label: 'Contact',
      icon: <HugeiconsIcon color='white' size={20}  icon={UserIcon}/>
    }
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
              <TouchableHighlight
                key={i}
                underlayColor='black'
                onPress={onPress || onClose}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  //justifyContent: 'space-between',
                  paddingHorizontal: 4,
                  height: 45.5,
                  borderRadius: 100,
                  //backgroundColor: 'pink',
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <View style={{
                    height: 37,
                    width: 37,
                    borderRadius: 100,
                    backgroundColor : '#1d1d1d',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0,
                  }}>
                    {icon}
                  </View>
                  <Text style={{
                    fontSize: 16,
                    color: 'white'
                  }}>
                    {label}
                  </Text>
                </View>
              </TouchableHighlight>
            ))}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    backgroundColor: '#161616',
    position: 'absolute',
    bottom: 60,
    left: 5,
    padding: 10,
    minWidth: 200,
    //gap: 25
  },
});

export default MessagesOptions;