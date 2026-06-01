import { Stack, router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native'

export default function Header({
  title,
  headerTitleAlign,
  headerRightContents,
  headerRight,
  headerLeft,
  headerRightStyle,
  headerRightMargin = 15,
  headerLeftMargin = 15,
  cornerSpace = true,
  height,
  isBack = false,
  hd = false,
  backIcon = (<ArrowLeft color='white'/>),
  titleStyle
}) {
  return (
    <Stack.Screen
      options={{
        headerShown: hd? true : undefined,
        headerStyle: {
          backgroundColor: '#0a0a0a',
          height: 50,
        },
        headerTitleAlign,
        headerTitle: () => (
          <Text numberOfLines={1} 
            style={{ 
              fontSize: 22, 
              fontWeight: 'bold',
              color: 'white',
              ...titleStyle
            }}>
            {title}
          </Text>
        ),
        headerLeft: () => (
          <View style={{
            marginLeft: headerLeftMargin || '',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {isBack && <TouchableOpacity onPress={() => router.back()} style={{
              marginRight: 15,
            }}>
              {backIcon}
            </TouchableOpacity>}
            {headerLeft}
          </View>
        ) || null,
        headerRight: () => (
          <View style={{ 
            flexDirection: 'row',
            gap: 17.5, 
            marginRight: headerRightMargin || '',
            ...headerRightStyle
          }}>
            {headerRightContents || headerRight}
          </View>
        ),
      }}
    />
  );
}