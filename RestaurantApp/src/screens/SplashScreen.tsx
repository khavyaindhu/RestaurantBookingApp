import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <Icon name="silverware-fork-knife" size={60} color="#FF6B35" />
        </View>
        <Text style={styles.title}>TableVault</Text>
        <Text style={styles.subtitle}>Reserve Your Perfect Seat</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { alignItems: 'center' },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D1B69',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7BA8',
    marginTop: 8,
    letterSpacing: 1,
  },
});

export default SplashScreen;
