import { createMMKV } from 'react-native-mmkv'
export const storage = new createMMKV({
  id: 'quonvers-storage'
});