import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useBooking, TimeSlot } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const SEAT_PRICE = 299; // ₹ per seat

const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const {
    selectedRestaurant, selectedDate, selectedTime, selectedSeats,
    setSelectedDate, setSelectedTime, setSelectedSeats, getAvailableSlots,
  } = useBooking();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const r = selectedRestaurant!;

  useEffect(() => {
    if (r) setSlots(getAvailableSlots(r.id, selectedDate));
  }, [selectedDate, r]);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  const handleProceed = () => {
    if (!selectedTime) {
      Toast.show({ type: 'error', text1: 'Please select a time slot' });
      return;
    }
    const slot = slots.find(s => s.time === selectedTime);
    if (!slot || slot.availableSeats < selectedSeats) {
      Toast.show({ type: 'error', text1: 'Not enough seats for selected slot' });
      return;
    }
    navigation.navigate('Payment', {
      bookingData: {
        restaurantName: r.name,
        date: selectedDate.toDateString(),
        time: selectedTime,
        seats: selectedSeats,
        totalAmount: selectedSeats * SEAT_PRICE,
      },
    });
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Table</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantBar}>
          <Icon name="silverware-fork-knife" size={18} color="#FF6B35" />
          <Text style={styles.restaurantName}>{r.name}</Text>
        </View>

        {/* Step 1: Date */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
            <Text style={styles.stepTitle}>Select Date</Text>
          </View>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar" size={20} color="#FF6B35" />
            <Text style={styles.dateBtnText}>{formatDate(selectedDate)}</Text>
            <Icon name="chevron-down" size={20} color="#8B7BA8" />
          </TouchableOpacity>
          <DatePicker
            modal
            open={showDatePicker}
            date={selectedDate}
            mode="date"
            minimumDate={minDate}
            maximumDate={maxDate}
            onConfirm={date => { setShowDatePicker(false); setSelectedDate(date); setSelectedTime(''); }}
            onCancel={() => setShowDatePicker(false)}
          />
        </View>

        {/* Step 2: Time Slot */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
            <Text style={styles.stepTitle}>Select Time Slot</Text>
          </View>
          <View style={styles.slotsGrid}>
            {slots.map(slot => {
              const isSelected = selectedTime === slot.time;
              const isFull = !slot.isAvailable;
              return (
                <TouchableOpacity
                  key={slot.time}
                  style={[
                    styles.slotChip,
                    isSelected && styles.slotChipSelected,
                    isFull && styles.slotChipFull,
                  ]}
                  onPress={() => !isFull && setSelectedTime(slot.time)}
                  disabled={isFull}
                >
                  <Text style={[
                    styles.slotTime,
                    isSelected && styles.slotTimeSelected,
                    isFull && styles.slotTimeFull,
                  ]}>
                    {slot.time}
                  </Text>
                  <Text style={[
                    styles.slotSeats,
                    isSelected && styles.slotSeatsSelected,
                    isFull && styles.slotSeatsFull,
                  ]}>
                    {isFull ? 'Full' : `${slot.availableSeats} seats`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 3: Number of Seats */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
            <Text style={styles.stepTitle}>Number of Seats</Text>
          </View>
          <View style={styles.seatRow}>
            <TouchableOpacity
              style={styles.seatCtrlBtn}
              onPress={() => selectedSeats > 1 && setSelectedSeats(selectedSeats - 1)}
            >
              <Icon name="minus" size={22} color="#FF6B35" />
            </TouchableOpacity>
            <View style={styles.seatCount}>
              <Icon name="seat" size={24} color="#FF6B35" />
              <Text style={styles.seatCountText}>{selectedSeats}</Text>
            </View>
            <TouchableOpacity
              style={styles.seatCtrlBtn}
              onPress={() => selectedSeats < 10 && setSelectedSeats(selectedSeats + 1)}
            >
              <Icon name="plus" size={22} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          <Text style={styles.seatHint}>Max 10 seats per booking</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          {[
            { label: 'Restaurant', val: r.name },
            { label: 'Date', val: formatDate(selectedDate) },
            { label: 'Time', val: selectedTime || 'Not selected' },
            { label: 'Seats', val: `${selectedSeats} seat${selectedSeats > 1 ? 's' : ''}` },
          ].map(item => (
            <View key={item.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryVal}>{item.val}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalVal}>₹{(selectedSeats * SEAT_PRICE).toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>₹{(selectedSeats * SEAT_PRICE).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
          <Text style={styles.proceedBtnText}>Proceed to Pay</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
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
  scroll: { padding: 16, paddingBottom: 100 },
  restaurantBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#231040', borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#FF6B3540',
  },
  restaurantName: { color: '#FF6B35', fontWeight: '700', fontSize: 15 },
  stepCard: {
    backgroundColor: '#231040', borderRadius: 16, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: '#2D1B69',
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  stepBadge: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#FF6B35',
    justifyContent: 'center', alignItems: 'center',
  },
  stepNum: { color: '#fff', fontWeight: '800', fontSize: 13 },
  stepTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  dateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1A0A2E', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: '#3D2B80',
  },
  dateBtnText: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotChip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#1A0A2E', borderWidth: 1, borderColor: '#3D2B80', alignItems: 'center',
  },
  slotChipSelected: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  slotChipFull: { backgroundColor: '#1A0A2E', borderColor: '#3D2B80', opacity: 0.5 },
  slotTime: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  slotTimeSelected: { color: '#FFFFFF' },
  slotTimeFull: { color: '#4A3D6B' },
  slotSeats: { color: '#8B7BA8', fontSize: 11, marginTop: 2 },
  slotSeatsSelected: { color: '#fff' },
  slotSeatsFull: { color: '#4A3D6B' },
  seatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  seatCtrlBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    borderColor: '#FF6B35', justifyContent: 'center', alignItems: 'center',
  },
  seatCount: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seatCountText: { color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  seatHint: { color: '#4A3D6B', fontSize: 12, textAlign: 'center', marginTop: 12 },
  summaryCard: {
    backgroundColor: '#231040', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#2D1B69',
  },
  summaryTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { color: '#8B7BA8', fontSize: 14 },
  summaryVal: { color: '#FFFFFF', fontSize: 14 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 14, marginTop: 8, borderTopWidth: 1, borderTopColor: '#2D1B69',
  },
  totalLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  totalVal: { color: '#FF6B35', fontSize: 20, fontWeight: '800' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#231040', padding: 16, borderTopWidth: 1, borderTopColor: '#2D1B69',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  priceLabel: { color: '#8B7BA8', fontSize: 12 },
  priceValue: { color: '#FF6B35', fontSize: 22, fontWeight: '800' },
  proceedBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  proceedBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});

export default BookingScreen;
