import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Text, StyleSheet, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image02Icon, MicIcon, SearchIcon, UserCircleIcon, AddCircleIcon, AddIcon, Unlink04Icon, CameraIcon, ViewIcon, SmileIcon, LinkForwardIcon, NotificationIcon, TimelineListIcon, PinIcon, Clock05Icon, Delete02Icon, LockIcon, Calendar02Icon, SaveIcon } from '@hugeicons/core-free-icons';
import { ChevronRight } from 'lucide-react-native'
import { useCustomAlert } from '@/hooks/alert'
import { router } from 'expo-router'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import Switch from '@/components/reusables/switch'
import Sheet from '@/components/reusables/bottomSheet'
import { BottomSheetView } from '@gorhom/bottom-sheet';

export type OptionsProps = {
  label? : string,
  sub_label : string | null,
  action : () => void,
  icon: React.ReactNode,
  danger? : boolean
}

const SheetComp = ({onClose, showSheet = 'hide'}) => {
  const alert = useCustomAlert()
  const bottomRef = React.useRef(null)
  const defaultBottom = useSharedValue(200)
  
  const openSheet = useCallback(() => {
    bottomRef.current?.snapToIndex(0);
  }, []);
  
  useEffect(() => {
    if(typeof showSheet !== 'string') return
    if(showSheet == 'hide') closeSheet()
    if(showSheet == 'show') openSheet()
  }, [showSheet])

  const closeSheet = useCallback(() => {
    bottomRef.current?.close();
  }, []);
  
  const options = [
    {
      label: 'Schedule',
      sub_label: null,
      action: () => {},
      icon: <HugeiconsIcon color='white' size={25} icon={Clock05Icon} />
    },
    {
      label: 'Pin to profile',
      sub_label: null,
      action: () => {},
      icon: <HugeiconsIcon color='white' size={25} icon={PinIcon}/>
    },
    {
      label: 'Notification',
      sub_label: null,
      icon: <HugeiconsIcon color='white' size={25} icon={NotificationIcon}/>,
      action: () => {}
    },
    {
      label: 'Expiration date',
      sub_label: null,
      icon: <HugeiconsIcon color='white' size={25} icon={Calendar02Icon}/>,
      action: () => {}
    },
    {
      label: 'Detached access',
      sub_label: null,
      icon: <HugeiconsIcon color='white' size={25} icon={Unlink04Icon}/>,
      action: () => {}
    },
    {
      label: 'Ultra lock',
      icon: <HugeiconsIcon color='white' size={25} icon={LockIcon}/>,
      sub_label: null,
      action: async () => {
        await onClose()
        setTimeout(() => {
          alert('Ultra lock', `Ultra lock is a protection layer to the content you share, it helps prevent actions such as forwarding, saving or taking a screenshot of the content. Note that the screenshot prevention is inefficient in iPhone devices due to iOS restrictions.`, [
            {
              text: 'Cancel',
              onPress: () => {
                onClose()
              }
            },
            {
              text: 'Turn on',
              primary:true,
              onPress: () => onClose()
            },
          ])
        }, 50);
      },
    },
    /*
    {
      label: 'Allow screenshot',
      sub_label: null,
      icon: <HugeiconsIcon color='white' size={25} icon={CameraIcon}/>,
      action: () => {}
    },
    {
      label: 'Allow forwarding',
      icon: <HugeiconsIcon color='white' size={25} icon={LinkForwardIcon}/>,
      sub_label: null,
      action: () => {}
},
  */
    {
      label: 'Show likes and other counts',
      sub_label: null,
      icon: <HugeiconsIcon color='white' size={25} icon={ViewIcon}/>,
      action: () => {}
    },
    {
      label: 'Discard',
      sub_label: null,
      action: async () => {
        await onClose()
        setTimeout(() => {
          alert('Discard', 'Are you sure you want to discard?', [
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => {
                router.back()
                onClose()
              }
            },
            {
              text: 'Cancel',
              onPress: () => onClose()
            },
          ])
        }, 50);
      },
      danger: true,
      icon: <HugeiconsIcon color='tomato' icon={Delete02Icon}/>
    }
  ]
  
  return (
    <Sheet ref={bottomRef} snaps={['50%']} index={1}>
      <BottomSheetView style={{
        zIndex: 1,
      }}>
      {options.map(({label, sub_label, action, icon: Icon, danger}, i) => (
        <TouchableOpacity onPress={action} underlayColor='red' style={{
          padding: 12.5,
          paddingHorizontal: 20,
          //paddingRight: 10,
          width: '100%',
        }} key={i}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{
              gap: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              {Icon}
              <Text style={{
                color: danger? 'tomato' : 'white',
                fontSize: 15,
              }}>{label}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10
            }}>
              <Text style={{
                color: 'darkgrey',
              }}>{sub_label}</Text>
              <Switch enabled={i == 5 || i == 2}/>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      </BottomSheetView>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default SheetComp;