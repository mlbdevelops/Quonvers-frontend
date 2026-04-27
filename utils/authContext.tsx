import { createContext, useState, useEffect, PropsWithChildren } from 'react'
import { useRouter } from 'expo-router'
import { SplashScreen } from 'expo-router'
import { storage } from '@/storage/mmkv'

SplashScreen.preventAutoHideAsync()

type TempUserData = {
  email: string
  name: string
  username: string
  password: string
  birthdate: string
}

type AuthState = {
  isLoggedIn: boolean
  isReady: boolean
  user: any | null
  logIn: (user: any) => void
  logOut: () => void
  tempUserData: TempUserData
  insertIntoTemp: (data: string, step: keyof TempUserData) => { ok: boolean }
}

const authStoreKey = 'user'

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  user: null,
  logIn: () => {},
  logOut: () => {},
  tempUserData: {
    email: '',
    name: '',
    username: '',
    password: '',
    birthdate: ''
  },
  insertIntoTemp: () => ({ ok: false })
})

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [tempUserData, setTempUserData] = useState<TempUserData>({
    email: '',
    name: '',
    username: '',
    password: '',
    birthdate: ''
  })
  const router = useRouter()
  
  const storeAuthState = (newState: { isLoggedIn, user }) => {
    try {
      storage.set(authStoreKey, JSON.stringify(newState))
    } catch (error) {
      console.error('Failed to store auth state:', error)
    }
  }
  
  const logIn = (user: any) => {
    setUser(user)
    storeAuthState({ isLoggedIn: true, user })
    setIsLoggedIn(true)
    router.replace('/(protected)')
  }
  
  const logOut = () => {
    setIsLoggedIn(false)
    setUser(null)
    storage.remove(authStoreKey)
    router.replace('/authenticate')
  }
  
  const insertIntoTemp = (data: string, step: keyof TempUserData) => {
    setTempUserData(prev => ({ ...prev, [step]: data }))
    return { ok: true }
  }
  
  useEffect(() => {
    try {
      const value = storage.getString(authStoreKey)
      if (value) {
        const auth = JSON.parse(value)
        setUser(auth.user)
        setIsLoggedIn(auth.isLoggedIn)
      }
    } catch (error) {
      console.error('Failed to load auth state:', error)
    } finally {
      setIsReady(true)
      SplashScreen.hideAsync()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isReady,
        user,
        logIn,
        logOut,
        tempUserData,
        insertIntoTemp
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}