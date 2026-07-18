import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function CountdownTimer({ initialSeconds = 60 }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  // Start the countdown
  const startTimer = () => {
    if (!isActive && secondsLeft > 0) {
      setIsActive(true);
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Pause the countdown
  const pauseTimer = () => {
    if (isActive) {
      clearInterval(timerRef.current);
      setIsActive(false);
    }
  };

  // Reset the countdown
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setSecondsLeft(initialSeconds);
  };

  // Clear interval on unmount to prevent memory leaks
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
      <View style={styles.buttonRow}>
        {isActive ? (
          <Button title="Pause" onPress={pauseTimer} color="#FF9500" />
        ) : (
          <Button title="Start" onPress={startTimer} color="#34C759" disabled={secondsLeft === 0} />
        )}
        <Button title="Reset" onPress={resetTimer} color="#FF3B30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    fontVariant: ['tabular-nums'], // Prevents numbers from shifting layout width
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
});
