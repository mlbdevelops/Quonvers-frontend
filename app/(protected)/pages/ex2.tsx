import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  BackHandler
} from 'react-native';

import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import Sheet from '@/components/reusables/bottomSheet'
const { width } = Dimensions.get('window');

export default function CrazyBottomSheetScreen() {
  const bottomSheetRef = useRef(null);
  const [isSheetOpened, setIsSheetOpened] = useState(false)
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  
  useEffect(() => {
    //return console.log(BackHandler)
    const backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if(bottomSheetRef.current && isSheetOpened) {
        bottomSheetRef.current?.close()
        setIsSheetOpened(false)
        return true
      }
      return false
    })
    return () => backhandler.remove()
  })

  const openSheet = useCallback(() => {
    setIsSheetOpened(true)
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeSheet = useCallback(() => {
    setIsSheetOpened(false)
    bottomSheetRef.current?.close();
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Floating Glow */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      {/* Hero Content */}
      <Text style={styles.logo}>Q</Text>

      <Text style={styles.title}>
        Futuristic Bottom Sheet
      </Text>

      <Text style={styles.subtitle}>
        Tap below to launch the insane UI
      </Text>

      {/* Open Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.button}
        onPress={openSheet}
      >
        <Text style={styles.buttonText}>
          Open Bottom Sheet
        </Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Sheet
        ref={bottomSheetRef}
        snaps={['50%']}
        index={1}
      >
          <BottomSheetScrollView showsVerticalScrollIndicator={false} style={{
            flex: 1,
            height: 300,
          }}>
          <Text style={styles.sheetTitle}>
            Welcome To Quonvers
          </Text>

          <Text style={styles.sheetSubtitle}>
            Privacy-first conversations with futuristic interactions.
          </Text>

          {/* Fake futuristic cards */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              🔒 End-to-End Privacy
            </Text>

            <Text style={styles.cardText}>
              Your conversations stay yours.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              🌍 Discover Safely
            </Text>

            <Text style={styles.cardText}>
              Meet people only when you allow it.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ Ultra Fast Messaging
            </Text>

            <Text style={styles.cardText}>
              Built with realtime architecture.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeSheet}
          >
            <Text style={styles.closeText}>
              Close
            </Text>
          </TouchableOpacity>
          </BottomSheetScrollView>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  orb1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: '#2563eb',
    top: 100,
    left: -120,
    opacity: 0.3,
  },

  orb2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: '#9333ea',
    bottom: 100,
    right: -100,
    opacity: 0.3,
  },

  logo: {
    fontSize: 120,
    fontWeight: '900',
    color: 'white',
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    marginTop: 20,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    marginTop: 14,
  },

  button: {
    marginTop: 50,
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 18,
    shadowColor: '#2563eb',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  sheetBackground: {
    backgroundColor: '#171717',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  indicator: {
    backgroundColor: 'rgba(122,122,122,0.4)',
    width: 70,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },

  sheetTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
  },

  sheetSubtitle: {
    color: 'rgba(255,255,255,0.65)',
    marginTop: 12,
    lineHeight: 24,
    fontSize: 16,
  },

  card: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },

  cardText: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
    lineHeight: 22,
  },

  closeButton: {
    marginTop: 30,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },

  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});