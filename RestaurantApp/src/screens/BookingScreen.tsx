import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useBooking, TimeSlot } from '../context/BookingContext';
import { Colors, Shadow } from '../utils/theme';

const SEAT_PRICE = 299;

const BookingScreen = () => {
  const navigation = useNavigation<any>();
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
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 30);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleProceed = () => {
    if (!selectedTime) { Toast.show({ type: 'error', text1: 'Please select a time slot' }); return; }
    const slot = slots.find(s => s.time === selectedTime);
    if (!slot || slot.availableSeats < selectedSeats) {
      Toast.show({ type: 'error', text1: 'Not enough seats for selected time' }); return;
    }
    navigation.navigate('Payment', {
      bookingData: {
        restaurantName: r.name, date: selectedDate.toDateString(),
        time: selectedTime, seats: selectedSeats, totalAmount: selectedSeats * SEAT_PRICE,
      },
    });
  };

  const StepLabel = ({ num, title, done }: { num: string; title: string; done: boolean }) => (
    <View style={styles.stepLabel}>
      <View style={[styles.stepBadge, done && styles.stepBadgeDone]}>
        {done
          ? <Icon name="check" size={12} color={Colors.textInverse} />
          : <Text style={styles.stepNum}>{num}</Text>
        }
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
    </View>
  );

  const totalAmount = selectedSeats * SEAT_PRICE;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Make a Reservation</Text>
          <Text style={styles.headerSub}>{r.name}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Step 1 — Date */}
        <View style={styles.stepCard}>
          <StepLabel num="1" title="SELECT DATE" done={true} />
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)} activeOpacity={0.85}>
            <View>
              <Text style={styles.dateLabel}>RESERVATION DATE</Text>
              <Text style={styles.dateValue}>{formatDate(selectedDate)}</Text>
            </View>
            <Icon name="calendar-outline" size={20} color={Colors.gold} />
          </TouchableOpacity>
          <DatePicker
            modal open={showDatePicker} date={selectedDate} mode="date"
            minimumDate={minDate} maximumDate={maxDate}
            onConfirm={date => { setShowDatePicker(false); setSelectedDate(date); setSelectedTime(''); }}
            onCancel={() => setShowDatePicker(false)}
          />
        </View>

        {/* Step 2 — Time */}
        <View style={styles.stepCard}>
          <StepLabel num="2" title="SELECT TIME SLOT" done={!!selectedTime} />
          <View style={styles.slotsGrid}>
            {slots.map(slot => {
              const isSelected = selectedTime === slot.time;
              const isFull = !slot.isAvailable;
              return (
                <TouchableOpacity
                  key={slot.time}
                  style={[
                    styles.slot,
                    isSelected && styles.slotSelected,
                    isFull && styles.slotFull,
                  ]}
                  onPress={() => !isFull && setSelectedTime(slot.time)}
                  disabled={isFull}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.slotTime, isSelected && styles.slotTimeSelected, isFull && styles.slotTimeFull]}>
                    {slot.time}
                  </Text>
                  <Text style={[styles.slotSeats, isSelected && styles.slotSeatsSelected, isFull && styles.slotSeatsFull]}>
                    {isFull ? 'Full' : `${slot.availableSeats}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedTime && (
            <View style={styles.slotSelectedNote}>
              <Icon name="check-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.slotSelectedNoteText}>Time slot {selectedTime} selected</Text>
            </View>
          )}
        </View>

        {/* Step 3 — Seats */}
        <View style={styles.stepCard}>
          <StepLabel num="3" title="NUMBER OF GUESTS" done={true} />
          <View style={styles.seatSelector}>
            <TouchableOpacity
              style={[styles.seatBtn, selectedSeats <= 1 && styles.seatBtnDisabled]}
              onPress={() => selectedSeats > 1 && setSelectedSeats(selectedSeats - 1)}
              disabled={selectedSeats <= 1}
            >
              <Icon name="minus" size={18} color={selectedSeats <= 1 ? Colors.textMuted : Colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.seatCount}>
              <Text style={styles.seatCountNum}>{selectedSeats}</Text>
              <Text style={styles.seatCountLabel}>{selectedSeats === 1 ? 'guest' : 'guests'}</Text>
            </View>

            <TouchableOpacity
              style={[styles.seatBtn, selectedSeats >= 10 && styles.seatBtnDisabled]}
              onPress={() => selectedSeats < 10 && setSelectedSeats(selectedSeats + 1)}
              disabled={selectedSeats >= 10}
            >
              <Icon name="plus" size={18} color={selectedSeats >= 10 ? Colors.textMuted : Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.seatHint}>Maximum 10 guests per reservation</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>BOOKING SUMMARY</Text>
          {[
            { label: 'Restaurant', value: r.name },
            { label: 'Date', value: formatDate(selectedDate) },
            { label: 'Time', value: selectedTime || '—' },
            { label: 'Guests', value: `${selectedSeats} ${selectedSeats === 1 ? 'person' : 'persons'}` },
            { label: 'Per Seat', value: `₹${SEAT_PRICE}` },
          ].map(item => (
            <View key={item.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toLocaleString()}</Text>
          </View>
        </View>

      </ScrollView>

      {/* CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalBarLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.totalBarValue}>₹{totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.proceedBtnText}>CONTINUE</Text>
          <Icon name="arrow-right" size={16} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.bg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  headerSub: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: 1 },
  scroll: { padding: 20, paddingBottom: 110 },
  stepCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  stepLabel: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  stepBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.bgDark,
    justifyContent: 'center', alignItems: 'center',
  },
  stepBadgeDone: { backgroundColor: Colors.success },
  stepNum: { fontSize: 11, fontWeight: '700', color: Colors.textInverse },
  stepTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1 },
  datePicker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surfaceWarm, borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  dateLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 },
  dateValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceWarm,
    alignItems: 'center', minWidth: 72,
  },
  slotSelected: { backgroundColor: Colors.bgDark, borderColor: Colors.bgDark },
  slotFull: { opacity: 0.4 },
  slotTime: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  slotTimeSelected: { color: Colors.textInverse },
  slotTimeFull: { color: Colors.textMuted },
  slotSeats: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  slotSeatsSelected: { color: 'rgba(248,245,240,0.7)' },
  slotSeatsFull: { color: Colors.textMuted },
  slotSelectedNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  slotSelectedNoteText: { fontSize: 12, color: Colors.success, fontWeight: '500' },
  seatSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32 },
  seatBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  seatBtnDisabled: { borderColor: Colors.border, opacity: 0.4 },
  seatCount: { alignItems: 'center' },
  seatCountNum: { fontSize: 40, fontWeight: '700', color: Colors.textPrimary, lineHeight: 44 },
  seatCountLabel: { fontSize: 12, color: Colors.textMuted },
  seatHint: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 12 },
  summaryCard: {
    backgroundColor: Colors.surfaceWarm, borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: Colors.border,
  },
  summaryTitle: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 14 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Shadow.lg,
  },
  totalBarLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: 2 },
  totalBarValue: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  proceedBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  proceedBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textInverse, letterSpacing: 1.5 },
});

export default BookingScreen;
