import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Platform, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';
import { useBooking, Booking } from '../context/BookingContext';
import { Colors, Shadow } from '../utils/theme';

declare const window: any;

const STATUS = {
  confirmed: { color: Colors.success,  bg: Colors.successBg, icon: 'check-circle-outline',  label: 'Confirmed' },
  cancelled: { color: Colors.danger,   bg: Colors.dangerBg,  icon: 'close-circle-outline',  label: 'Cancelled' },
  completed: { color: Colors.textMuted, bg: Colors.border,   icon: 'check-all',             label: 'Completed' },
};

const BookingCard = ({ booking, onCancel }: { booking: Booking; onCancel: () => void }) => {
  const st = STATUS[booking.bookingStatus] || STATUS.confirmed;
  return (
    <View style={styles.card}>
      {/* Top row: restaurant + status */}
      <View style={styles.cardTop}>
        <View style={styles.cardTopLeft}>
          <Text style={styles.cardRestaurant} numberOfLines={1}>{booking.restaurantName}</Text>
          <Text style={styles.cardCode}>#{booking.confirmationCode}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
          <Icon name={st.icon} size={12} color={st.color} />
          <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Details row */}
      <View style={styles.cardDetails}>
        <View style={styles.cardDetail}>
          <Icon name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardDetailText}>{booking.date}</Text>
        </View>
        <View style={styles.cardDetail}>
          <Icon name="clock-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardDetailText}>{booking.time}</Text>
        </View>
        <View style={styles.cardDetail}>
          <Icon name="account-group-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.cardDetailText}>{booking.seats} {booking.seats === 1 ? 'guest' : 'guests'}</Text>
        </View>
      </View>

      {/* Payment row */}
      <View style={styles.cardPayRow}>
        <Text style={styles.cardPayLabel}>
          {booking.paymentStatus === 'paid' ? 'Paid' : 'Pay at restaurant'}
        </Text>
        {booking.paymentStatus === 'paid' && (
          <Text style={styles.cardPayAmount}>₹{booking.totalAmount.toLocaleString()}</Text>
        )}
      </View>

      {/* Cancel */}
      {booking.bookingStatus === 'confirmed' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
          <Icon name="close-circle-outline" size={16} color={Colors.danger} />
          <Text style={styles.cancelBtnText}>Cancel Reservation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const MyBookingsScreen = () => {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const bookings = useMemo(() => {
    console.log('Fetching bookings for user:', user?.id);
    const userBookings = getUserBookings(user?.id || '');
    console.log('Current bookings:', userBookings);
    return userBookings;
  }, [user?.id, refreshKey]);

  const showConfirmDialog = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    if (Platform.OS === 'web') {
      // For web platform, use confirm dialog
      if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
        const confirmed = window.confirm(message);
        if (confirmed) {
          onConfirm();
        } else if (onCancel) {
          onCancel();
        }
      } else {
        // Fallback if window is not available
        onConfirm();
      }
    } else {
      // For native platforms, use Alert
      Alert.alert(
        'Cancel Reservation',
        message,
        [
          {
            text: 'Keep Reservation',
            style: 'cancel',
            onPress: onCancel,
          },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: onConfirm,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleCancel = useCallback((booking: Booking) => {
    console.log('handleCancel called for booking:', booking.id);
    
    const message = `Are you sure you want to cancel your table at ${booking.restaurantName} on ${booking.date} at ${booking.time}?`;
    
    showConfirmDialog(
      message,
      // On confirm
      () => {
        console.log('User confirmed cancellation');
        try {
          cancelBooking(booking.id);
          console.log('cancelBooking executed');
          
          // Force refresh
          setRefreshKey(prev => prev + 1);
          
          Toast.show({ 
            type: 'success', 
            text1: 'Reservation Cancelled',
            text2: `Your booking at ${booking.restaurantName} has been cancelled`
          });
        } catch (error) {
          console.error('Error cancelling booking:', error);
          Toast.show({ 
            type: 'error', 
            text1: 'Cancellation Failed',
            text2: 'Please try again'
          });
        }
      },
      // On cancel
      () => {
        console.log('User cancelled the cancellation');
      }
    );
  }, [cancelBooking]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reservations</Text>
        <Text style={styles.headerSub}>{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        extraData={refreshKey}
        renderItem={({ item }) => (
          <BookingCard 
            booking={item} 
            onCancel={() => {
              console.log('BookingCard onCancel triggered');
              handleCancel(item);
            }} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="calendar-blank-outline" size={32} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No reservations yet</Text>
            <Text style={styles.emptyText}>Your booking history will appear here</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.bgDark,
    paddingHorizontal: 24, paddingTop: 54, paddingBottom: 24,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#F8F5F0' },
  headerSub: { fontSize: 13, color: '#78716C', marginTop: 2 },
  listContent: { padding: 20, paddingBottom: 30 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  cardTopLeft: { flex: 1, marginRight: 12 },
  cardRestaurant: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  cardCode: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 14 },
  cardDetails: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginBottom: 12 },
  cardDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDetailText: { fontSize: 12, color: Colors.textSecondary },
  cardPayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPayLabel: { fontSize: 12, color: Colors.textSecondary },
  cardPayAmount: { fontSize: 14, fontWeight: '700', color: Colors.success },
  cancelBtn: {
    marginTop: 14, 
    paddingTop: 14, 
    paddingBottom: 2,
    borderTopWidth: 1, 
    borderTopColor: Colors.border,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  cancelBtnText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: Colors.danger, 
    letterSpacing: 0.3 
  },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.surfaceWarm,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyText: { fontSize: 13, color: Colors.textMuted },
});

export default MyBookingsScreen;