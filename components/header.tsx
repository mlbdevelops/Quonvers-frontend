import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Header({
  title,
  headerTitleAlign,
  headerRightContents,
  headerLeft,
  headerRightStyle,
  headerRightMargin = 15,
  headerLeftMargin = 15,
  cornerSpace = true,
  height
}) {
  return (
    <Stack.Screen
      options={{
        headerStyle: {
          backgroundColor: '#0a0a0a',
          height: 50,
        },
        headerTitleAlign,
        headerTitle: () => (
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', }}>
            {title}
          </Text>
        ),
        headerLeft: () => (
          <View style={{
            marginLeft: headerLeftMargin || '',
          }}>{headerLeft}</View>
        ) || null,
        headerRight: () => (
          <View style={{ 
            flexDirection: 'row',
            gap: 17.5, 
            marginRight: headerRightMargin || '',
            ...headerRightStyle
          }}>
            {headerRightContents}
          </View>
        ),
      }}
    />
  );
}