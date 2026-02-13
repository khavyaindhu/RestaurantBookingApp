import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadow } from '../utils/theme';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / Google Pay / PhonePe', sub: 'Instant payment via UPI ID', icon: 'cellphone-check' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: 'credit-card-outline' },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks supported', icon: 'bank-outline' },
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
    await new Promise(r => setTimeout(r, 2000));
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scroll} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >

        {/* Amount Hero */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>AMOUNT DUE</Text>
          <Text style={styles.amountValue}>₹{bookingData.totalAmount.toLocaleString()}</Text>
          <Text style={styles.amountBreakdown}>
            {bookingData.seats} seat{bookingData.seats > 1 ? 's' : ''}  ×  ₹299 per seat
          </Text>
          <View style={styles.amountDivider} />
          <View style={styles.amountDetails}>
            {[
              { icon: 'silverware-fork-knife', text: bookingData.restaurantName },
              { icon: 'calendar-outline', text: bookingData.date },
              { icon: 'clock-outline', text: `${bookingData.time} · ${bookingData.seats} seats` },
            ].map(item => (
              <View key={item.text} style={styles.amountDetailRow}>
                <Icon name={item.icon} size={13} color={Colors.textMuted} />
                <Text style={styles.amountDetailText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
        {PAYMENT_METHODS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, selectedMethod === m.id && styles.methodCardActive]}
            onPress={() => setSelectedMethod(m.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.methodIconBox, selectedMethod === m.id && styles.methodIconBoxActive]}>
              <Icon name={m.icon} size={20} color={selectedMethod === m.id ? Colors.textInverse : Colors.textSecondary} />
            </View>
            <View style={styles.methodText}>
              <Text style={[styles.methodLabel, selectedMethod === m.id && styles.methodLabelActive]}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
            <View style={[styles.radioOuter, selectedMethod === m.id && styles.radioOuterActive]}>
              {selectedMethod === m.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Security */}
        <View style={styles.secureRow}>
          <Icon name="shield-check-outline" size={14} color={Colors.success} />
          <Text style={styles.secureText}>256-bit SSL encryption  ·  PCI DSS compliant</Text>
        </View>

      </ScrollView>

      {/* Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.skipBtn} onPress={skipPayment} disabled={loading} activeOpacity={0.8}>
          <Text style={styles.skipBtnText}>Skip — Pay at Restaurant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payBtn} onPress={simulatePayment} disabled={loading} activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color={Colors.textInverse} size="small" />
            : <>
                <Icon name="lock-outline" size={16} color={Colors.textInverse} />
                <Text style={styles.payBtnText}>PAY  ₹{bookingData.totalAmount.toLocaleString()}</Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: 20, paddingBottom: 160 },

  amountCard: {
    backgroundColor: Colors.bgDark, borderRadius: 16, padding: 24,
    alignItems: 'center', marginBottom: 28, ...Shadow.md,
  },
  amountLabel: { fontSize: 10, fontWeight: '700', color: Colors.gold, letterSpacing: 2, marginBottom: 8 },
  amountValue: { fontSize: 48, fontWeight: '700', color: '#F8F5F0', marginBottom: 4 },
  amountBreakdown: { fontSize: 13, color: '#78716C', marginBottom: 20 },
  amountDivider: { width: '100%', height: 1, backgroundColor: '#2C2926', marginBottom: 16 },
  amountDetails: { width: '100%', gap: 8 },
  amountDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amountDetailText: { fontSize: 13, color: '#A8A29E' },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1.5, marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: Colors.border, marginBottom: 10, ...Shadow.sm,
  },
  methodCardActive: { borderColor: Colors.bgDark },
  methodIconBox: {
    width: 42, height: 42, borderRadius: 10, backgroundColor: Colors.surfaceWarm,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  methodIconBoxActive: { backgroundColor: Colors.bgDark, borderColor: Colors.bgDark },
  methodText: { flex: 1 },
  methodLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 2 },
  methodLabelActive: { color: Colors.textPrimary },
  methodSub: { fontSize: 11, color: Colors.textMuted },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  radioOuterActive: { borderColor: Colors.bgDark },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.bgDark },
  secureRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 8,
  },
  secureText: { fontSize: 11, color: Colors.success, fontWeight: '500' },

  bottomBar: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    backgroundColor: Colors.surface, 
    padding: 16, 
    gap: 10,
    paddingBottom: Platform.OS === 'web' ? 16 : 20,
    borderTopWidth: 1, 
    borderTopColor: Colors.border, 
    ...Shadow.lg,
    elevation: 10,
    minHeight: 140,
    ...(Platform.OS === 'web' && {
      position: 'fixed' as any,
      zIndex: 1000,
    }),
  },
  skipBtn: {
    borderRadius: 10, paddingVertical: 13, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  skipBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  payBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 10, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  payBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textInverse, letterSpacing: 1.5 },
});

export default PaymentScreen;