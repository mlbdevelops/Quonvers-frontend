import { useContext } from 'react'
import { AuthContext } from '../utils/authContext.tsx'

export default function userContext(){
  return useContext(AuthContext)
}
