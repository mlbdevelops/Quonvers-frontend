import 'react-native-gesture-handler'
import 'react-native-reanimated'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { withLayoutContext } from 'expo-router'
import { Toaster } from 'sonner-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SocketConnector from '../../hooks/sockets/socket_connector.js'
const { Navigator } = createStackNavigator()
const Stack = withLayoutContext(Navigator)
import { Redirect } from 'expo-router'
import { AuthContext } from '@/utils/authContext'
import { useContext } from 'react'

export default function ProtectedLayout() {
  const authContext = useContext(AuthContext)
  
  if (!authContext.isReady) {
    return null 
  }
  
  if (!authContext.isLoggedIn) {
    return <Redirect href='/authenticate'/>
  }
  
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider style={{ backgroundColor: '#0b0b0b', borderWidth: 0, flex: 1, }}>
        <SocketConnector/>
        <Toaster/>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'fade_from_right',
            //cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            cardStyle: { backgroundColor: '#0b0b0b', borderWidth: 0, },
          }}
        >
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
