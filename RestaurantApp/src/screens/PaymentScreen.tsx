import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, StatusBar, SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Colors, Shadow } from '../utils/theme';

const PaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const { confirmBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'pending' | 'paid' | 'skipped'>('skipped');

  const { bookingData } = route.params;

  const handleConfirmBooking = async () => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Please login to continue' });
      return;
    }

    setLoading(true);
    try {
      console.log('💳 Processing booking with payment:', selectedPayment);

      // Create booking with persistence
      const newBooking = await confirmBooking(
        user.id,
        selectedPayment,
        bookingData.totalAmount
      );

      if (newBooking) {
        console.log('✅ Booking confirmed:', newBooking);

        Toast.show({
          type: 'success',
          text1: 'Booking Confirmed!',
          text2: `Confirmation code: ${newBooking.confirmationCode}`,
          visibilityTime: 4000,
        });

        // Navigate to main tabs (bookings screen)
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'Bookings' } }],
          });
        }, 1500);
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>BOOKING SUMMARY</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Restaurant</Text>
            <Text style={styles.summaryValue}>{bookingData.restaurantName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{bookingData.date}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{bookingData.time}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Guests</Text>
            <Text style={styles.summaryValue}>{bookingData.seats} persons</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{bookingData.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Options */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === 'paid' && styles.paymentOptionSelected]}
            onPress={() => setSelectedPayment('paid')}
            activeOpacity={0.7}
          >
            <Icon
              name={selectedPayment === 'paid' ? 'radiobox-marked' : 'radiobox-blank'}
              size={20}
              color={selectedPayment === 'paid' ? Colors.success : Colors.textMuted}
            />
            <View style={styles.paymentOptionText}>
              <Text style={styles.paymentOptionTitle}>Pay Now</Text>
              <Text style={styles.paymentOptionDesc}>Secure online payment</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === 'skipped' && styles.paymentOptionSelected]}
            onPress={() => setSelectedPayment('skipped')}
            activeOpacity={0.7}
          >
            <Icon
              name={selectedPayment === 'skipped' ? 'radiobox-marked' : 'radiobox-blank'}
              size={20}
              color={selectedPayment === 'skipped' ? Colors.success : Colors.textMuted}
            />
            <View style={styles.paymentOptionText}>
              <Text style={styles.paymentOptionTitle}>Pay at Restaurant</Text>
              <Text style={styles.paymentOptionDesc}>Pay when you arrive</Text>
            </View>
          </TouchableOpacity>
        </View>

       
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmBooking}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.confirmText}>CONFIRM BOOKING</Text>
              <Icon name="check" size={16} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: 20, paddingBottom: 120 },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  summaryHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, textAlign: 'right', maxWidth: '60%' },
  totalRow: { borderBottomWidth: 0, paddingTop: 14, marginTop: 6 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  paymentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    backgroundColor: Colors.bg,
  },
  paymentOptionSelected: {
    borderColor: Colors.success,
    backgroundColor: Colors.successBg,
  },
  paymentOptionText: { flex: 1 },
  paymentOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  paymentOptionDesc: { fontSize: 12, color: Colors.textMuted },
  infoCard: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  confirmBtn: {
    backgroundColor: Colors.bgDark,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1.2,
  },
});

export default PaymentScreen;