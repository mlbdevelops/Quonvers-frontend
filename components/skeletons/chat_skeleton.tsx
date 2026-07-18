import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import FadeInView from '@/components/reusables/fadeInView'
export default function ChatSkeleton() {
  return(
    <FadeInView
      startingOpacity={.1}
      style={styles.box}
    >
      <View 
        style={{
          backgroundColor: '#262626',
          width: 50,
          height: 50,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ></View>
      
      <View className='flex-1 flex flex-col' style={styles.name_msg}>
        <View
          style={{
            width: 120,
            borderRadius: 50,
            height: 12,
            backgroundColor: '#262626',
          }}
        ></View>
        <View
          style={{
            width: 220,
            borderRadius: 50,
            height: 12,
            backgroundColor: '#262626',
          }}
          >
        </View>
      </View>
    </FadeInView>
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
    height: 70,
  },
  
  name_msg: {
    marginLeft: 10,
    height: '83%',
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