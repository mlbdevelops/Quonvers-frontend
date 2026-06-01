import { View, Platform, Text } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BubbleChatIcon, SearchIcon, FavouriteIcon, Notification01Icon, Home03Icon, Chat01Icon, UserIcon, UserStoryIcon, Calendar02Icon, Clock05Icon, GridViewIcon, MailIcon, CarouselHorizontal02Icon, FireIcon, UserMultipleIcon, BubblesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import haptics from '@/hooks/haptics'
import { Bubbles } from 'lucide-react-native'

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const { bottom } = useSafeAreaInsets()
  const { handleViber } = haptics()
  
  const icon = {
    index: ((props: any) => (
      <HugeiconsIcon icon={Chat01Icon} strokeWidth={1.8} {...props} />
    )),
    requests: ((props: any) => (
      <HugeiconsIcon icon={UserMultipleIcon} strokeWidth={1.8} {...props} />
    )),
    feed: ((props: any) => (
      <HugeiconsIcon icon={FireIcon} strokeWidth={1.8} {...props} />
    )),
    bubbles: ((props: any) => (
      <Bubbles strokeWidth={1.8} {...props} />
    )),
    testtab: ((props: any) => (
      <Bubbles strokeWidth={1.8} {...props} />
    )),
  }
  
  const names = {
    index: ((props: TextProps) => (
      <Text {...props}>Chats</Text>
    )),
    requests: ((props: TextProps) => (
      <Text {...props}>Requests</Text>
    )),
    feed: ((props: TextProps) => (
      <Text {...props}>Moments</Text>
    )),
    bubbles: ((props: TextProps) => (
      <Text {...props}>Bubbles</Text>
    )),
    testtab: ((props: TextProps) => (
      <Text {...props}>tt</Text>
    )),
  }
  
  return (
    <View 
      className='w-full bg-[#0b0b0b] border-0 border-t-[1px solid #101010]  flex flex-row items-center justify-around pt-2'
      style={{
        backgroundColor: '#0b0b0b',
        paddingBottom: bottom > 10? (bottom + 2) : 8,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
              
        const isFocused = state.index === index;
        const onPress = async () => {
          await handleViber.Strong()
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };
        
        const onLongPress = () => {
          handleViber.Strong()
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        
        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              padding: 4,
              paddingVertical: 0,
              flexDirection: 'column',
              alignItems: 'center',
              //borderWidth: 1,
              //borderColor: 'red',
            }}
          >
            {
              icon[route.name]({
                color: isFocused ? '#6a69fe' : 'darkgray',
                //fill: isFocused ? '#6a69fe' : 'transparent',
              })
            }
            {
              names[route.name]({
                style: {
                  color: isFocused ? '#6a69fe' : 'darkgray',
                  fontSize: 10,
                }
              })
            }
          </PlatformPressable>
        );
      })}
    </View>
  );
}

