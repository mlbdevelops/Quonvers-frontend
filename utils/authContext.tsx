import { createContext, useState, useEffect } from 'react'
import { useRouter, SplashScreen } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync()

type AuthState = {
  isLoggedIn: Boolean;
  isReady: Boolean;
  user: Object;
  logIn: () => void;
  logOut: () => void;
  temp_user_data: Object;
  insert_into_temp: () => void,
};

const authStoreKey = 'user'

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  user: null,
  isReady: false,
  logIn: () => {},
  logOut: () => {},
  insert_into_temp: () => {},
  temp_user_data: {}
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const router = useRouter()
  const temp_user_data = {
    email: '',
    name: '',
    username: '',
    password: '',
    birthdate: '',
  }
  
  const storeAuthState = async (newState: { isLoggedIn: Boolean, user: Object }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStoreKey, jsonValue)
    } catch (error) {
      console.error(error);
    }
  }
  
  const logIn = (user) => {
    setUser(user)
    setIsLoggedIn(true)
    storeAuthState({ isLoggedIn : true, user })
    router.replace('/(protected)')
  }
  
  const logOut = async () => {
    setIsLoggedIn(false)
    setUser(null)
    await AsyncStorage.removeItem('user')
    await AsyncStorage.removeItem('token')
    storeAuthState({ isLoggedIn : false, user: null })
    router.replace('/authenticate')
  }
  
  const insert_into_temp = (data, step) => {
    step == 'email'? temp_user_data.email = data: null
    step == 'username'? temp_user_data.username = data : null
    step == 'name'? temp_user_data.name = data : null
    step == 'password'? temp_user_data.password = data : null
    step == 'birthdate'? temp_user_data.birthdate = data : null
    
    return {
      ok: true
    }
  }
  
  useEffect(() => {
    const getValueFromStorage = async () => {
      try {
        const authStore = await AsyncStorage.getItem(authStoreKey)
        if (authStore !== null) {
          const auth = JSON.parse(authStore);
          setIsLoggedIn(auth.isLoggedIn)
          setUser(auth.user)
        }
      } catch (error) {
        console.error('👉', error);
      }
      setIsReady(true)
    }
    getValueFromStorage()
  }, [])
  
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync()
    }
  }, [isReady])
  
  
  return (
    <AuthContext.Provider value={{
      isReady,
      isLoggedIn,
      logIn,
      logOut,
      user,
      temp_user_data,
      insert_into_temp,
      token
    }}>
      {children}
    </AuthContext.Provider>
  );
};
