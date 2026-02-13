import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../utils/theme';

const SplashScreen = () => {
  const fade = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const lineFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(lineFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.decorLine1} />
      <View style={styles.decorLine2} />

      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
        <View style={styles.monogram}>
          <Text style={styles.monogramText}>TV</Text>
        </View>
        <Animated.View style={{ opacity: lineFade, alignItems: 'center' }}>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.brandName}>TableVault</Text>
          <Text style={styles.tagline}>FINE DINING  ·  RESERVATIONS</Text>
        </Animated.View>
      </Animated.View>

      <Text style={styles.footer}>Coimbatore's Premier Table Booking</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDark, justifyContent: 'center', alignItems: 'center' },
  decorLine1: { position: 'absolute', top: '25%', left: 0, right: 0, height: 1, backgroundColor: '#C9A84C15' },
  decorLine2: { position: 'absolute', top: '75%', left: 0, right: 0, height: 1, backgroundColor: '#C9A84C15' },
  content: { alignItems: 'center', gap: 20 },
  monogram: {
    width: 80, height: 80, borderRadius: 4,
    borderWidth: 1.5, borderColor: Colors.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  monogramText: { fontSize: 26, fontWeight: '300', color: Colors.gold, letterSpacing: 6 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  dividerLine: { width: 40, height: 0.5, backgroundColor: Colors.gold },
  dividerDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.gold },
  brandName: { fontSize: 32, fontWeight: '300', color: '#F8F5F0', letterSpacing: 8, marginBottom: 6 },
  tagline: { fontSize: 10, fontWeight: '600', color: Colors.gold, letterSpacing: 3 },
  footer: { position: 'absolute', bottom: 40, fontSize: 11, color: '#78716C', letterSpacing: 1 },
});

export default SplashScreen;
