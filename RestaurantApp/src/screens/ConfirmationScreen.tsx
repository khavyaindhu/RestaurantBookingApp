import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Booking } from '../context/BookingContext';

const ConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { booking }: { booking: Booking } = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1, friction: 4, tension: 60, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShare = async () => {
    await Share.share({
      message:
        `🎉 Table Reserved!\n\n` +
        `Restaurant: ${booking.restaurantName}\n` +
        `Date: ${booking.date}\n` +
        `Time: ${booking.time}\n` +
        `Seats: ${booking.seats}\n` +
        `Confirmation Code: ${booking.confirmationCode}\n\n` +
        `Booked via TableVault`,
    });
  };

  const goHome = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0, routes: [{ name: 'Main' }],
    }));
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.successInner}>
          <Icon name="check-bold" size={50} color="#4CAF50" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          {booking.paymentStatus === 'paid'
            ? '🎉 Payment successful! Your table is reserved.'
            : '✅ Your table is reserved. Pay at the restaurant.'}
        </Text>

        {/* Confirmation Code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Confirmation Code</Text>
          <Text style={styles.codeValue}>{booking.confirmationCode}</Text>
          <Text style={styles.codeHint}>Show this at the restaurant</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          {[
            { icon: 'silverware-fork-knife', label: 'Restaurant', val: booking.restaurantName },
            { icon: 'calendar', label: 'Date', val: booking.date },
            { icon: 'clock-outline', label: 'Time', val: booking.time },
            { icon: 'seat', label: 'Seats', val: `${booking.seats} seat${booking.seats > 1 ? 's' : ''}` },
            {
              icon: 'cash', label: 'Payment',
              val: booking.paymentStatus === 'paid'
                ? `✅ Paid ₹${booking.totalAmount.toLocaleString()}`
                : '⏳ Pay at restaurant',
            },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Icon name={item.icon} size={16} color="#FF6B35" />
                <Text style={styles.detailLabel}>{item.label}</Text>
              </View>
              <Text style={styles.detailVal}>{item.val}</Text>
            </View>
          ))}
        </View>

        {/* SMS/Email note */}
        <View style={styles.notifBox}>
          <Icon name="bell-check-outline" size={18} color="#FF6B35" />
          <Text style={styles.notifText}>Confirmation sent via SMS & Email to your registered details</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Icon name="share-variant" size={18} color="#FF6B35" />
          <Text style={styles.shareBtnText}>Share Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
          <Icon name="home" size={18} color="#fff" />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#1A0A2E',
    paddingHorizontal: 20, paddingTop: 60, alignItems: 'center',
  },
  successCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#4CAF5020', borderWidth: 3, borderColor: '#4CAF50',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  successInner: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#4CAF5030', justifyContent: 'center', alignItems: 'center',
  },
  content: { width: '100%', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8B7BA8', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  codeCard: {
    backgroundColor: '#FF6B3515', borderRadius: 16, padding: 20,
    borderWidth: 2, borderColor: '#FF6B35', alignItems: 'center', width: '100%', marginBottom: 16,
  },
  codeLabel: { color: '#8B7BA8', fontSize: 12, marginBottom: 8 },
  codeValue: { fontSize: 32, fontWeight: '800', color: '#FF6B35', letterSpacing: 4 },
  codeHint: { color: '#8B7BA8', fontSize: 12, marginTop: 8 },
  detailsCard: {
    backgroundColor: '#231040', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#2D1B69', width: '100%', marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#2D1B6940',
  },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { color: '#8B7BA8', fontSize: 13 },
  detailVal: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  notifBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FF6B3510', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#FF6B3530', width: '100%', marginBottom: 16,
  },
  notifText: { color: '#C4B5E0', fontSize: 12, flex: 1 },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%',
    borderRadius: 12, paddingVertical: 14, justifyContent: 'center',
    borderWidth: 1, borderColor: '#FF6B35', marginBottom: 10,
  },
  shareBtnText: { color: '#FF6B35', fontWeight: '700', fontSize: 15 },
  homeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%',
    backgroundColor: '#FF6B35', borderRadius: 12, paddingVertical: 16, justifyContent: 'center',
  },
  homeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});

export default ConfirmationScreen;
