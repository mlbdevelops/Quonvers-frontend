import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/header'
import { Stack } from 'expo-router'
import { Check, X } from 'lucide-react-native'
import Button from '@/components/reusables/button.tsx'
import FullSL from '@/hooks/fullSL'

const SubscriptionPage = () => {
  const [isLoading, setisLoading] = React.useState(false)
  const [showFullSL, setShowFullSL] = React.useState(false)
  
  const subscribe = async () => {
    setisLoading(true)
    setShowFullSL(true)
    setTimeout(() => {
      setShowFullSL(false)
      setisLoading(false)
    }, 3000);
  }
  
  const list = [
    'Unlimited moments media sharing',
    'Unlimited photos and videos sharing in chats',
    'Unlimited HD video calls',
    'Unlimited High quality audio calls',
    'Up to 20 minutes of video sharing in chats',
    'High resolution photos sharing in chats and moments',
    'Background customization in chats',
  ]
  
  const comparisonList = [
    {
      feature: 'Audio calls quality',
      free: 'Standard',
      pro: 'High'
    },
    {
      feature: 'Video & audio calls effects',
      free: false,
      pro: true
    },
    {
      feature: 'Create a channel',
      free: false,
      pro: true
    },
    {
      feature: 'Longer moment storage',
      free: false,
      pro: true
    },
    {
      feature: 'Special VIP badge',
      free: false,
      pro: true
    },
    {
      feature: 'Read receipt',
      free: false,
      pro: true
    },
    {
      feature: 'Chat customization',
      free: false,
      pro: true
    },
    {
      feature: 'HD video calls',
      free: false,
      pro: true
    },
  ]
  
  return (
    <View style={styles.container}>
      <Header hd title={'Subscription'} isBack/>
      {showFullSL? <FullSL onClose={() => setShowFullSL(false)}/> : null}
      <View style={{
        gap: 10
      }}>
      <Text style={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
      }}>Quonvers <Text style={{
        color: '#6a69fe',
      }}>Pro</Text></Text>
      <Text style={{
        color: 'white',
      }}>Subscribe to the pro plan to get the best experience and a dedicated VIP badge</Text>
      </View>
      <View>
        <Text style={{
          color: 'white',
          marginBottom: 15,
          fontWeight: 'bold',
        }}>Comparison</Text>
        <ScrollView
          style={{
            //flex: 1,
            //backgroundColor: 'white',
            height: '67%',
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{
            borderWidth: 1,
            borderColor: '#1d1d1d',
            borderRadius: 20,
            overflow: 'hidden',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: '#1d1d1d',
              width: '100%',
            }}>
              <View style={{
                flex: 1,
                paddingLeft: 15,
              }}>
                <Text style={{color: 'white', fontWeight: 'bold',}}>Features</Text>
              </View>
              <View style={{
                paddingVertical: 10,
                width: 80,
                alignItems: 'center',
                justifyContent: 'center',
                //paddingLeft: 20,
              }}>
                <Text style={{color: 'white', fontWeight: 'bold',}}>Free</Text>
              </View>
              <View style={{
                width: 80,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                //paddingLeft: 10,
              }}>
                <Text style={{color: 'white', fontWeight: 'bold',}}>Pro</Text>
              </View>
            </View>
            {comparisonList.map(({ feature, pro, free }, i) => (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                //height: 30,
                borderBottomWidth: i == comparisonList.length - 1? 0 : 1,
                borderColor: '#0a0a0a',
                backgroundColor: '#1d1d1d',
              }} key={i}>
                <View style={{
                  flex: 1,
                }}><Text style={{
                  color: 'white',
                  //backgroundColor: 'red',
                  paddingLeft: 15,
                }}>{feature}</Text></View>
                <View style={{
                  height: 60,
                  width: 80,
                  borderLeftWidth: 1,
                  borderColor: '#1d1d1d',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}><Text style={{
                  color: 'white',
                }}>
                    {/*<X color='tomato'/>*/}
                    {typeof free == 'boolean'? '_' : free}
                  </Text>
                </View>
                <View style={{
                  height: 60,
                  width: 80,
                  borderLeftWidth: 1,
                  borderColor: '#1d1d1d',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}><Text style={{
                  color: '#6a69fe',
                }}>
                    {typeof pro == 'boolean'? <Check color='#6a69fe'/> : pro}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <Text style={{
        textAlign: 'center',
        color: '#797979',
        marginTop: 10,
      }}>Don't forget that you can cancel anytime</Text>
      <Button loading={isLoading} onPress={subscribe} style={{
      }} title='Subscribe for $3.99/month'/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 15,
    justifyContent: 'space-evenly',
  },
});

export default SubscriptionPage;