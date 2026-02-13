import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / Google Pay / PhonePe', icon: 'cellphone-check' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'credit-card-outline' },
  { id: 'netbanking', label: 'Net Banking', icon: 'bank-outline' },
];

const PaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingData } = route.params;
  const { user } = useAuth();
  const { confirmBooking } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const simulatePayment = async () => {
    setLoading(true);
    // Simulate API payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    const booking = confirmBooking(user!.id, 'paid', bookingData.totalAmount);
    navigation.replace('Confirmation', { booking });
  };

  const skipPayment = () => {
    const booking = confirmBooking(user!.id, 'skipped', 0);
    navigation.replace('Confirmation', { booking });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountIcon}>
            <Icon name="receipt" size={30} color="#FF6B35" />
          </View>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>₹{bookingData.totalAmount.toLocaleString()}</Text>
          <Text style={styles.amountSub}>{bookingData.seats} seat{bookingData.seats > 1 ? 's' : ''} × ₹299</Text>
        </View>

        {/* Booking Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Booking Details</Text>
          {[
            { icon: 'silverware-fork-knife', label: bookingData.restaurantName },
            { icon: 'calendar', label: bookingData.date },
            { icon: 'clock-outline', label: bookingData.time },
            { icon: 'seat', label: `${bookingData.seats} seat${bookingData.seats > 1 ? 's' : ''}` },
          ].map(item => (
            <View key={item.label} style={styles.infoRow}>
              <Icon name={item.icon} size={16} color="#FF6B35" />
              <Text style={styles.infoText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.methodCard}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodRow, selectedMethod === m.id && styles.methodRowActive]}
              onPress={() => setSelectedMethod(m.id)}
            >
              <Icon name={m.icon} size={22} color={selectedMethod === m.id ? '#FF6B35' : '#8B7BA8'} />
              <Text style={[styles.methodLabel, selectedMethod === m.id && styles.methodLabelActive]}>
                {m.label}
              </Text>
              <View style={[styles.radio, selectedMethod === m.id && styles.radioActive]}>
                {selectedMethod === m.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Note */}
        <View style={styles.secureRow}>
          <Icon name="shield-check" size={16} color="#4CAF50" />
          <Text style={styles.secureText}>Secured by 256-bit SSL encryption</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.skipBtn} onPress={skipPayment} disabled={loading}>
          <Text style={styles.skipBtnText}>Skip, Book for Free</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payBtn} onPress={simulatePayment} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="lock" size={18} color="#fff" />
              <Text style={styles.payBtnText}>Pay ₹{bookingData.totalAmount.toLocaleString()}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scroll: { padding: 16, paddingBottom: 120 },
  amountCard: {
    backgroundColor: '#231040', borderRadius: 20, padding: 24, alignItems: 'center',
    borderWidth: 1, borderColor: '#FF6B3540', marginBottom: 16,
  },
  amountIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF6B3520',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#FF6B3560',
  },
  amountLabel: { color: '#8B7BA8', fontSize: 14, marginBottom: 8 },
  amountValue: { color: '#FFFFFF', fontSize: 40, fontWeight: '800' },
  amountSub: { color: '#8B7BA8', fontSize: 13, marginTop: 4 },
  infoCard: {
    backgroundColor: '#231040', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#2D1B69', marginBottom: 16,
  },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  infoText: { color: '#C4B5E0', fontSize: 14 },
  methodCard: {
    backgroundColor: '#231040', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#2D1B69', marginBottom: 12,
  },
  methodRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: 12, borderWidth: 1, borderColor: '#3D2B80', marginBottom: 10,
  },
  methodRowActive: { borderColor: '#FF6B35', backgroundColor: '#FF6B3510' },
  methodLabel: { flex: 1, color: '#8B7BA8', fontSize: 14 },
  methodLabelActive: { color: '#FFFFFF' },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: '#4A3D6B', justifyContent: 'center', alignItems: 'center',
  },
  radioActive: { borderColor: '#FF6B35' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B35' },
  secureRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8,
  },
  secureText: { color: '#4CAF50', fontSize: 12 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#231040', padding: 16, borderTopWidth: 1, borderTopColor: '#2D1B69', gap: 10,
  },
  skipBtn: {
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#3D2B80',
  },
  skipBtnText: { color: '#8B7BA8', fontWeight: '600', fontSize: 14 },
  payBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  payBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});

export default PaymentScreen;
