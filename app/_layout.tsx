import './global.css'
//import { Stack } from 'expo-router'
import 'react-native-gesture-handler'
import 'react-native-reanimated'
import 'react-native-get-random-values'
import { StatusBar } from 'expo-status-bar'
import React from 'react';
import { AuthProvider } from '@/utils/authContext.tsx'
//import { Toaster } from 'sonner-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { withLayoutContext } from 'expo-router'
import { Toaster } from '@/components/reusables/systemToast'
import { CustomAlertProvider as AlertProvider } from '@/hooks/alert'
import { OptionListProvider } from '@/hooks/optionList'

const { Navigator } = createStackNavigator()
const Stack = withLayoutContext(Navigator)

const RootLayout = () => {
  return (
    <GestureHandlerRootView>
      <AlertProvider>
        <OptionListProvider>
          <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#0a0a0a',
            borderWidth: 0
          }}>
            <StatusBar style='auto'/>
            <AuthProvider>
              <Stack screenOptions={{
                  headerShown: false,
                  //gestureEnabled: true,
                  animation: 'slide_from_right',
                  //cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                  //transitionSpec: {
                    //open: { duration: 0 },
                   // close: { duration: 0 },
                  //},
                  cardStyle: { backgroundColor: '#0b0b0b', borderWidth: 0, },
                }}>
                
                <Stack.Screen name='(protected)' options={{
                  headerShown: false,
                  animation: 'none'
                }}/>
                
                <Stack.Screen name='authenticate' options={{
                  headerShown: false,
                  animation: 'none'
                }}/>
                
                <Stack.Screen name='auth' options={{
                  headerShown: false,
                }}/>
                
              </Stack>
            </AuthProvider>
          </SafeAreaView>
        </OptionListProvider>
      </AlertProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;