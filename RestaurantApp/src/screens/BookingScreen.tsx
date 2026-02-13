import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useBooking, TimeSlot } from '../context/BookingContext';
import { Colors, Shadow } from '../utils/theme';

const SEAT_PRICE = 299;
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ─── Inline Calendar Modal ────────────────────────────────────────────────────
interface CalendarProps {
  visible: boolean;
  currentDate: Date;
  onConfirm: (d: Date) => void;
  onCancel: () => void;
}

const CalendarModal = ({ visible, currentDate, onConfirm, onCancel }: CalendarProps) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 30); maxDate.setHours(0,0,0,0);

  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [selected, setSelected] = useState(new Date(currentDate));

  const goBack = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full 6 rows
  while (cells.length % 7 !== 0) cells.push(null);

  const checkDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day); d.setHours(0,0,0,0);
    return d < today || d > maxDate;
  };
  const checkSelected = (day: number) =>
    selected.getDate() === day &&
    selected.getMonth() === viewMonth &&
    selected.getFullYear() === viewYear;
  const checkToday = (day: number) =>
    today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={calStyles.overlay}>
        <View style={calStyles.card}>
          {/* Month Navigation */}
          <View style={calStyles.navRow}>
            <TouchableOpacity onPress={goBack} style={calStyles.navBtn}>
              <Icon name="chevron-left" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={calStyles.monthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={goNext} style={calStyles.navBtn}>
              <Icon name="chevron-right" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Day Labels */}
          <View style={calStyles.dayRow}>
            {DAY_LABELS.map(d => (
              <Text key={d} style={calStyles.dayLabel}>{d}</Text>
            ))}
          </View>

          {/* Dates Grid */}
          <View style={calStyles.grid}>
            {cells.map((day, idx) => {
              const disabled = day ? checkDisabled(day) : true;
              const sel = day ? checkSelected(day) : false;
              const tod = day ? checkToday(day) : false;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[calStyles.cell, sel && calStyles.cellSelected, tod && !sel && calStyles.cellToday]}
                  onPress={() => { if (day && !disabled) setSelected(new Date(viewYear, viewMonth, day)); }}
                  disabled={!day || disabled}
                  activeOpacity={0.7}
                >
                  {day ? (
                    <Text style={[
                      calStyles.cellText,
                      sel && calStyles.cellTextSel,
                      disabled && calStyles.cellTextDis,
                      tod && !sel && calStyles.cellTextToday,
                    ]}>
                      {day}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={calStyles.actions}>
            <TouchableOpacity style={calStyles.cancelBtn} onPress={onCancel}>
              <Text style={calStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={calStyles.confirmBtn} onPress={() => onConfirm(new Date(selected))}>
              <Text style={calStyles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const calStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(28,25,23,0.6)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  card: {
    backgroundColor: Colors.surface, borderRadius: 18, padding: 20,
    width: '100%', maxWidth: 340, ...Shadow.lg,
  },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  monthTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  dayRow: { flexDirection: 'row', marginBottom: 8 },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%` as any, aspectRatio: 1,
    justifyContent: 'center', alignItems: 'center', borderRadius: 999,
  },
  cellSelected: { backgroundColor: Colors.bgDark },
  cellToday: { borderWidth: 1.5, borderColor: Colors.gold },
  cellText: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  cellTextSel: { color: Colors.textInverse, fontWeight: '700' },
  cellTextDis: { color: Colors.border },
  cellTextToday: { color: Colors.gold, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  cancelText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  confirmBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    backgroundColor: Colors.bgDark, alignItems: 'center',
  },
  confirmText: { fontSize: 13, fontWeight: '700', color: Colors.textInverse },
});

// ─── Main Booking Screen ──────────────────────────────────────────────────────
const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const {
    selectedRestaurant, selectedDate, selectedTime, selectedSeats,
    setSelectedDate, setSelectedTime, setSelectedSeats, getAvailableSlots,
  } = useBooking();

  const [showCalendar, setShowCalendar] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const r = selectedRestaurant!;

  useEffect(() => {
    if (r) setSlots(getAvailableSlots(r.id, selectedDate));
  }, [selectedDate, r]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleProceed = () => {
    if (!selectedTime) {
      Toast.show({ type: 'error', text1: 'Please select a time slot' }); return;
    }
    const slot = slots.find(s => s.time === selectedTime);
    if (!slot || slot.availableSeats < selectedSeats) {
      Toast.show({ type: 'error', text1: 'Not enough seats for selected time' }); return;
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

  const StepBadge = ({ num, done }: { num: string; done: boolean }) => (
    <View style={[styles.stepBadge, done && styles.stepBadgeDone]}>
      {done
        ? <Icon name="check" size={11} color="#fff" />
        : <Text style={styles.stepNum}>{num}</Text>
      }
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
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Make a Reservation</Text>
          <Text style={styles.headerSub}>{r?.name}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Step 1 — Date */}
        <View style={styles.stepCard}>
          <View style={styles.stepLabelRow}>
            <StepBadge num="1" done={true} />
            <Text style={styles.stepTitle}>SELECT DATE</Text>
          </View>
          <TouchableOpacity style={styles.dateTrigger} onPress={() => setShowCalendar(true)} activeOpacity={0.8}>
            <View>
              <Text style={styles.dateSmLabel}>RESERVATION DATE</Text>
              <Text style={styles.dateValue}>{formatDate(selectedDate)}</Text>
            </View>
            <Icon name="calendar-outline" size={22} color={Colors.gold} />
          </TouchableOpacity>
        </View>

        {/* Step 2 — Time Slots */}
        <View style={styles.stepCard}>
          <View style={styles.stepLabelRow}>
            <StepBadge num="2" done={!!selectedTime} />
            <Text style={styles.stepTitle}>SELECT TIME SLOT</Text>
          </View>
          <View style={styles.slotsGrid}>
            {slots.map(slot => {
              const isSel = selectedTime === slot.time;
              const isFull = !slot.isAvailable;
              return (
                <TouchableOpacity
                  key={slot.time}
                  style={[styles.slot, isSel && styles.slotSel, isFull && styles.slotFull]}
                  onPress={() => !isFull && setSelectedTime(slot.time)}
                  disabled={isFull}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.slotTime, isSel && styles.slotTimeSel, isFull && styles.slotTimeDis]}>
                    {slot.time}
                  </Text>
                  <Text style={[styles.slotSeats, isSel && styles.slotSeatsSel, isFull && styles.slotSeatsDis]}>
                    {isFull ? 'Full' : `${slot.availableSeats} seats`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedTime && (
            <View style={styles.selectedNote}>
              <Icon name="check-circle-outline" size={14} color={Colors.success} />
              <Text style={styles.selectedNoteText}>{selectedTime} selected</Text>
            </View>
          )}
        </View>

        {/* Step 3 — Guests */}
        <View style={styles.stepCard}>
          <View style={styles.stepLabelRow}>
            <StepBadge num="3" done={true} />
            <Text style={styles.stepTitle}>NUMBER OF GUESTS</Text>
          </View>
          <View style={styles.guestRow}>
            <TouchableOpacity
              style={[styles.guestBtn, selectedSeats <= 1 && styles.guestBtnDis]}
              onPress={() => selectedSeats > 1 && setSelectedSeats(selectedSeats - 1)}
              disabled={selectedSeats <= 1}
            >
              <Icon name="minus" size={18} color={selectedSeats <= 1 ? Colors.border : Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.guestCount}>
              <Text style={styles.guestNum}>{selectedSeats}</Text>
              <Text style={styles.guestLabel}>{selectedSeats === 1 ? 'guest' : 'guests'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.guestBtn, selectedSeats >= 10 && styles.guestBtnDis]}
              onPress={() => selectedSeats < 10 && setSelectedSeats(selectedSeats + 1)}
              disabled={selectedSeats >= 10}
            >
              <Icon name="plus" size={18} color={selectedSeats >= 10 ? Colors.border : Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.guestHint}>Up to 10 guests per reservation</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>BOOKING SUMMARY</Text>
          {[
            { label: 'Restaurant', val: r?.name },
            { label: 'Date', val: formatDate(selectedDate) },
            { label: 'Time', val: selectedTime || '—' },
            { label: 'Guests', val: `${selectedSeats} ${selectedSeats === 1 ? 'person' : 'persons'}` },
            { label: 'Rate', val: `₹${SEAT_PRICE} / seat` },
          ].map((item, i, arr) => (
            <View key={item.label} style={[styles.summRow, i === arr.length - 1 && styles.summRowLast]}>
              <Text style={styles.summLabel}>{item.label}</Text>
              <Text style={styles.summValue}>{item.val}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toLocaleString()}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>TOTAL</Text>
          <Text style={styles.bottomAmount}>₹{totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.proceedText}>CONTINUE</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <CalendarModal
        visible={showCalendar}
        currentDate={selectedDate}
        onConfirm={date => { setShowCalendar(false); setSelectedDate(date); setSelectedTime(''); }}
        onCancel={() => setShowCalendar(false)}
      />
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
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  scroll: { padding: 20, paddingBottom: 120 },

  stepCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 18,
    marginBottom: 16, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  stepLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  stepBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.bgDark,
    justifyContent: 'center', alignItems: 'center',
  },
  stepBadgeDone: { backgroundColor: Colors.success },
  stepNum: { fontSize: 11, fontWeight: '700', color: '#fff' },
  stepTitle: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1 },

  dateTrigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surfaceWarm, borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  dateSmLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 },
  dateValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },

  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surfaceWarm, alignItems: 'center', minWidth: 76,
  },
  slotSel: { backgroundColor: Colors.bgDark, borderColor: Colors.bgDark },
  slotFull: { opacity: 0.4 },
  slotTime: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  slotTimeSel: { color: '#fff' },
  slotTimeDis: { color: Colors.textMuted },
  slotSeats: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  slotSeatsSel: { color: 'rgba(255,255,255,0.65)' },
  slotSeatsDis: {},
  selectedNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  selectedNoteText: { fontSize: 12, color: Colors.success, fontWeight: '500' },

  guestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
  guestBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  guestBtnDis: { opacity: 0.35 },
  guestCount: { alignItems: 'center' },
  guestNum: { fontSize: 42, fontWeight: '700', color: Colors.textPrimary, lineHeight: 46 },
  guestLabel: { fontSize: 12, color: Colors.textMuted },
  guestHint: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 10 },

  summaryCard: {
    backgroundColor: Colors.surfaceWarm, borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: Colors.border,
  },
  summaryHeading: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 14 },
  summRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summRowLast: { borderBottomWidth: 0 },
  summLabel: { fontSize: 13, color: Colors.textSecondary },
  summValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, maxWidth: '55%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Shadow.lg,
  },
  bottomLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: 2 },
  bottomAmount: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  proceedBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  proceedText: { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 1.5 },
});

export default BookingScreen;