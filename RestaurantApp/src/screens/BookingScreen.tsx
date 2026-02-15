import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Modal, Platform, SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { TimeSlot } from '../context/BookingContext';
import { useBooking } from '../context/BookingContext';

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
          <View style={calStyles.navRow}>
            <TouchableOpacity onPress={goBack} style={calStyles.navBtn}>
              <Icon name="chevron-left" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={calStyles.monthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={goNext} style={calStyles.navBtn}>
              <Icon name="chevron-right" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={calStyles.dayRow}>
            {DAY_LABELS.map(d => (
              <Text key={d} style={calStyles.dayLabel}>{d}</Text>
            ))}
          </View>

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
    flex: 1, backgroundColor: 'rgba(28,25,23,0.7)',
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
    width: `${100 / 7}%`, aspectRatio: 1,
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

// ─── Booking Details Modal ────────────────────────────────────────────────────
interface BookingModalProps {
  visible: boolean;
  restaurant: any;
  selectedDate: Date;
  selectedTime: string;
  selectedSeats: number;
  slots: TimeSlot[];
  onDatePress: () => void;
  onTimeSelect: (time: string) => void;
  onSeatsChange: (seats: number) => void;
  onClose: () => void;
}

const BookingDetailsModal = ({
  visible, restaurant, selectedDate, selectedTime, selectedSeats,
  slots, onDatePress, onTimeSelect, onSeatsChange, onClose
}: BookingModalProps) => {
  
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  const StepBadge = ({ num, done }: { num: string; done: boolean }) => (
    <View style={[modalStyles.stepBadge, done && modalStyles.stepBadgeDone]}>
      {done
        ? <Icon name="check" size={11} color="#fff" />
        : <Text style={modalStyles.stepNum}>{num}</Text>
      }
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.headerTitle}>Booking Details</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
              <Icon name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={modalStyles.scroll}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Step 1 — Date */}
            <View style={modalStyles.stepCard}>
              <View style={modalStyles.stepLabelRow}>
                <StepBadge num="1" done={true} />
                <Text style={modalStyles.stepTitle}>SELECT DATE</Text>
              </View>
              <TouchableOpacity style={modalStyles.dateTrigger} onPress={onDatePress} activeOpacity={0.8}>
                <View>
                  <Text style={modalStyles.dateSmLabel}>RESERVATION DATE</Text>
                  <Text style={modalStyles.dateValue}>{formatDate(selectedDate)}</Text>
                </View>
                <Icon name="calendar-outline" size={22} color={Colors.gold} />
              </TouchableOpacity>
            </View>

            {/* Step 2 — Time Slots */}
            <View style={modalStyles.stepCard}>
              <View style={modalStyles.stepLabelRow}>
                <StepBadge num="2" done={!!selectedTime} />
                <Text style={modalStyles.stepTitle}>SELECT TIME SLOT</Text>
              </View>
              <View style={modalStyles.slotsGrid}>
                {slots.map(slot => {
                  const isSel = selectedTime === slot.time;
                  const isFull = !slot.isAvailable;
                  return (
                    <TouchableOpacity
                      key={slot.time}
                      style={[modalStyles.slot, isSel && modalStyles.slotSel, isFull && modalStyles.slotFull]}
                      onPress={() => !isFull && onTimeSelect(slot.time)}
                      disabled={isFull}
                      activeOpacity={0.75}
                    >
                      <Text style={[modalStyles.slotTime, isSel && modalStyles.slotTimeSel, isFull && modalStyles.slotTimeDis]}>
                        {slot.time}
                      </Text>
                      <Text style={[modalStyles.slotSeats, isSel && modalStyles.slotSeatsSel, isFull && modalStyles.slotSeatsDis]}>
                        {isFull ? 'Full' : `${slot.availableSeats} seats`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selectedTime && (
                <View style={modalStyles.selectedNote}>
                  <Icon name="check-circle-outline" size={14} color={Colors.success} />
                  <Text style={modalStyles.selectedNoteText}>{selectedTime} selected</Text>
                </View>
              )}
            </View>

            {/* Step 3 — Guests */}
            <View style={modalStyles.stepCard}>
              <View style={modalStyles.stepLabelRow}>
                <StepBadge num="3" done={true} />
                <Text style={modalStyles.stepTitle}>NUMBER OF GUESTS</Text>
              </View>
              <View style={modalStyles.guestRow}>
                <TouchableOpacity
                  style={[modalStyles.guestBtn, selectedSeats <= 1 && modalStyles.guestBtnDis]}
                  onPress={() => selectedSeats > 1 && onSeatsChange(selectedSeats - 1)}
                  disabled={selectedSeats <= 1}
                >
                  <Icon name="minus" size={18} color={selectedSeats <= 1 ? Colors.border : Colors.textPrimary} />
                </TouchableOpacity>
                <View style={modalStyles.guestCount}>
                  <Text style={modalStyles.guestNum}>{selectedSeats}</Text>
                  <Text style={modalStyles.guestLabel}>{selectedSeats === 1 ? 'guest' : 'guests'}</Text>
                </View>
                <TouchableOpacity
                  style={[modalStyles.guestBtn, selectedSeats >= 10 && modalStyles.guestBtnDis]}
                  onPress={() => selectedSeats < 10 && onSeatsChange(selectedSeats + 1)}
                  disabled={selectedSeats >= 10}
                >
                  <Icon name="plus" size={18} color={selectedSeats >= 10 ? Colors.border : Colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <Text style={modalStyles.guestHint}>Up to 10 guests per reservation</Text>
            </View>

            {/* Summary */}
            <View style={modalStyles.summaryCard}>
              <Text style={modalStyles.summaryHeading}>BOOKING SUMMARY</Text>
              {[
                { label: 'Restaurant', val: restaurant?.name },
                { label: 'Date', val: formatDate(selectedDate) },
                { label: 'Time', val: selectedTime || '—' },
                { label: 'Guests', val: `${selectedSeats} ${selectedSeats === 1 ? 'person' : 'persons'}` },
                { label: 'Rate', val: `₹${SEAT_PRICE} / seat` },
              ].map((item, i, arr) => (
                <View key={item.label} style={[modalStyles.summRow, i === arr.length - 1 && modalStyles.summRowLast]}>
                  <Text style={modalStyles.summLabel}>{item.label}</Text>
                  <Text style={modalStyles.summValue}>{item.val}</Text>
                </View>
              ))}
              <View style={modalStyles.totalRow}>
                <Text style={modalStyles.totalLabel}>Total</Text>
                <Text style={modalStyles.totalValue}>₹{(selectedSeats * SEAT_PRICE).toLocaleString()}</Text>
              </View>
            </View>

            <View style={{height: 20}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28,25,23,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    ...Shadow.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
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
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
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
});

// ─── Main Booking Screen ──────────────────────────────────────────────────────
const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const {
    selectedRestaurant, selectedDate, selectedTime, selectedSeats,
    setSelectedDate, setSelectedTime, setSelectedSeats, getAvailableSlots,
  } = useBooking();

  const [showCalendar, setShowCalendar] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const r = selectedRestaurant!;

  useEffect(() => {
    if (r) setSlots(getAvailableSlots(r.id, selectedDate));
  }, [selectedDate, r]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleProceed = () => {
    if (!selectedTime) {
      Toast.show({ type: 'error', text1: 'Please select a time slot' }); 
      setShowBookingModal(true);
      return;
    }
    const slot = slots.find(s => s.time === selectedTime);
    if (!slot || slot.availableSeats < selectedSeats) {
      Toast.show({ type: 'error', text1: 'Not enough seats for selected time' }); 
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

  const totalAmount = selectedSeats * SEAT_PRICE;

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Main Content */}
      <View style={styles.content}>
        {/* Booking Summary Card */}
        <TouchableOpacity 
          style={styles.summaryCard} 
          onPress={() => setShowBookingModal(true)}
          activeOpacity={0.9}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Icon name="calendar-outline" size={20} color={Colors.gold} />
              <View style={styles.summaryItemText}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Icon name="clock-outline" size={20} color={Colors.gold} />
              <View style={styles.summaryItemText}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{selectedTime || 'Not selected'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Icon name="account-group-outline" size={20} color={Colors.gold} />
              <View style={styles.summaryItemText}>
                <Text style={styles.summaryLabel}>Guests</Text>
                <Text style={styles.summaryValue}>{selectedSeats} {selectedSeats === 1 ? 'person' : 'persons'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.editHint}>
            <Text style={styles.editHintText}>Tap to modify booking details</Text>
            <Icon name="chevron-right" size={16} color={Colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="information-outline" size={20} color={Colors.gold} />
          <Text style={styles.infoText}>
            Your reservation will be held for 15 minutes. Please arrive on time.
          </Text>
        </View>
      </View>

      {/* Bottom Reserve Bar - Always Visible */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.bottomAmount}>₹{totalAmount.toLocaleString()}</Text>
          <Text style={styles.bottomSubtext}>{selectedSeats} × ₹{SEAT_PRICE}</Text>
        </View>
        <TouchableOpacity style={styles.reserveBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.reserveText}>RESERVE TABLE</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        visible={showBookingModal}
        restaurant={r}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedSeats={selectedSeats}
        slots={slots}
        onDatePress={() => {
          setShowBookingModal(false);
          setTimeout(() => setShowCalendar(true), 300);
        }}
        onTimeSelect={(time) => setSelectedTime(time)}
        onSeatsChange={(seats) => setSelectedSeats(seats)}
        onClose={() => setShowBookingModal(false)}
      />

      {/* Calendar Modal */}
      <CalendarModal
        visible={showCalendar}
        currentDate={selectedDate}
        onConfirm={date => { 
          setShowCalendar(false); 
          setSelectedDate(date); 
          setSelectedTime('');
          setTimeout(() => setShowBookingModal(true), 300);
        }}
        onCancel={() => {
          setShowCalendar(false);
          setTimeout(() => setShowBookingModal(true), 300);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  
  content: {
    flex: 1,
    padding: 20,
  },
  
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
    marginBottom: 16,
  },
  summaryRow: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryItemText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  editHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  editHintText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  
  infoCard: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  
  bottomBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.lg,
  },
  bottomLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  bottomAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bottomSubtext: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  reserveBtn: {
    backgroundColor: Colors.bgDark,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Shadow.md,
  },
  reserveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1.2,
  },
});

export default BookingScreen;