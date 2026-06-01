import Image from '../reusables/Image';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDb } from '@/storage/db'

const Info = ({id}) => {
  const [infoUser, setInfoUser] = React.useState({})
  
  React.useEffect(() => {
    ( async () => {
      const db = await getDb()
      const getDbData = await db.getFirstAsync('SELECT * FROM users WHERE user_id = ?', [id])
      setInfoUser(getDbData)
      console.log({getDbData})
    })()
  }, [])
  
  return (
    <View style={styles.container}>
      <View style={{
        minHeight: 100,
        width: '90%',
        borderRadius: 20,
        //backgroundColor: '#1d1d1d70',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        gap: 2
      }}>
        <Image size={100} src={infoUser?.avatar}/>
        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold',}}>{infoUser.name}</Text>
        <Text style={{color: 'darkgrey'}}>{infoUser.username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
});

export default Info;