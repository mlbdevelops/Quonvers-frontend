import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'

export default function ChatBox() {
  return(
    <TouchableOpacity
      style={styles.box}
      onPress={() => router.push('/pages/chat')}
    >
      <View 
        style={{
          backgroundColor: 'rgba(106,105,254,0.125)]',
          width: 50,
          borderRadius: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{
          color: '#6a69fe',
          fontWeight: 'bold',
          fontSize: 20,
        }}>M</Text>
      </View>
      
      <View className='flex-1 flex flex-col' style={styles.name_msg}>
        <Text className='text-white font-bold' 
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          John doe
        </Text>
        <Text 
          style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
          className='text-white font-bold'>
          Hello bruh, hope we'll be there...
        </Text>
      </View>
      <View style={styles.controls}>
        <Text style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: 12,
          marginBottom: 4,
        }}>4:18PM</Text>
        <View style={styles.badge}></View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    color: 'white',
    padding: 13,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 74,
  },
  
  name_msg: {
    marginLeft: 10,
    height: '95%',
    display: 'flex',
    justifyContent: 'space-between',
    //borderWidth: 2,
    //borderColor: 'red',
  },
  
  badge: {
    width: 10,
    height: 10,
    borderRadius: 50, 
    backgroundColor: '#6a69fe',
  },
  
  controls: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }
})