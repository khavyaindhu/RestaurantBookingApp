import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useBooking, Booking } from '../context/BookingContext';

const STATUS_CONFIG: Record<string, { color: string; icon: string; bg: string }> = {
  confirmed: { color: '#4CAF50', icon: 'check-circle', bg: '#4CAF5020' },
  cancelled: { color: '#FF4444', icon: 'close-circle', bg: '#FF444420' },
  completed: { color: '#8B7BA8', icon: 'check-all', bg: '#8B7BA820' },
};

const BookingCard = ({ booking, onCancel }: { booking: Booking; onCancel: () => void }) => {
  const status = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.confirmed;

  return (
    <View style={styles.card}>
      {/* Status & Code */}
      <View style={styles.cardTop}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Icon name={status.icon} size={14} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>
            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
          </Text>
        </View>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Code: </Text>
          <Text style={styles.codeVal}>{booking.confirmationCode}</Text>
        </View>
      </View>

      {/* Restaurant Name */}
      <Text style={styles.restaurantName}>{booking.restaurantName}</Text>

      {/* Details */}
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Icon name="calendar" size={14} color="#8B7BA8" />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detail}>
          <Icon name="clock-outline" size={14} color="#8B7BA8" />
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        <View style={styles.detail}>
          <Icon name="seat" size={14} color="#8B7BA8" />
          <Text style={styles.detailText}>{booking.seats} seat{booking.seats > 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Payment */}
      <View style={styles.payRow}>
        <Text style={styles.payLabel}>
          {booking.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pay at restaurant'}
        </Text>
        {booking.paymentStatus === 'paid' && (
          <Text style={styles.payAmount}>₹{booking.totalAmount.toLocaleString()}</Text>
        )}
      </View>

      {/* Cancel Button */}
      {booking.bookingStatus === 'confirmed' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Icon name="cancel" size={16} color="#FF4444" />
          <Text style={styles.cancelBtnText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const MyBookingsScreen = () => {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();

  const bookings = useMemo(() => getUserBookings(user?.id || ''), [user?.id]);

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Cancel reservation at ${booking.restaurantName} on ${booking.date} at ${booking.time}?`,
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Yes, Cancel', style: 'destructive',
          onPress: () => cancelBooking(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSub}>{bookings.length} reservation{bookings.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookingCard booking={item} onCancel={() => handleCancel(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="calendar-blank-outline" size={60} color="#3D2B80" />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySubtitle}>Your reservations will appear here</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E' },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { color: '#8B7BA8', fontSize: 13, marginTop: 4 },
  listContent: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: '#231040', borderRadius: 16, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: '#2D1B69',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  codeBox: { flexDirection: 'row', alignItems: 'center' },
  codeLabel: { color: '#8B7BA8', fontSize: 12 },
  codeVal: { color: '#FF6B35', fontSize: 12, fontWeight: '700' },
  restaurantName: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  detailsRow: { flexDirection: 'row', gap: 16, marginBottom: 10, flexWrap: 'wrap' },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { color: '#8B7BA8', fontSize: 13 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  payLabel: { color: '#C4B5E0', fontSize: 13 },
  payAmount: { color: '#4CAF50', fontWeight: '700', fontSize: 14 },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: '#2D1B69', justifyContent: 'center',
  },
  cancelBtnText: { color: '#FF4444', fontWeight: '600', fontSize: 14 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 12 },
  emptyTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  emptySubtitle: { color: '#8B7BA8', fontSize: 14 },
});

export default MyBookingsScreen;
