import { AsyncStorage as As } from '@react-native-async-storage/async-storage';

export default function AsyncStorage() {
  const getItem = async (key) => {
    try {
      const value = await As.getItem(key);
      if (value !== null) {
        return {
          code: 200,
          value: JSON.parse(value),
        }
      } else {
        return {
          code: 404
        };
      }
    } catch (error) {
      return {
        code: 500,
        msg: 'Error retrieving necessary informations'
      };
    }
  };
  
  const setItem = async (key, val) => {
    try {
      const value = await As.setItem(key, JSON.stringify(val));
    } catch (error) {
      return {
        status: 'err',
        error
      };
    }
  };
  
  
  return {
    getItem,
    setItem
  }
}