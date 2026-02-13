import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Share, ScrollView, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Booking } from '../context/BookingContext';
import { Colors, Shadow } from '../utils/theme';

const ConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { booking }: { booking: Booking } = route.params;

  const checkScale = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(cardSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleShare = async () => {
    await Share.share({
      message: `🎉 Table Reserved!\n\nRestaurant: ${booking.restaurantName}\nDate: ${booking.date}\nTime: ${booking.time}\nGuests: ${booking.seats}\nConfirmation: ${booking.confirmationCode}\n\nSee you at the table!`,
    });
  };

  const goHome = () => {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      {/* Dark top section */}
      <View style={styles.topSection}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
          <Icon name="check" size={36} color={Colors.bgDark} />
        </Animated.View>
        <Text style={styles.successTitle}>Reservation Confirmed</Text>
        <Text style={styles.successSub}>
          {booking.paymentStatus === 'paid' ? 'Payment received · ' : 'Pay at restaurant · '}
          Your table is secured
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: cardSlide }] }}>

          {/* Code card */}
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>CONFIRMATION CODE</Text>
            <Text style={styles.codeValue}>{booking.confirmationCode}</Text>
            <Text style={styles.codeHint}>Show this code at the restaurant</Text>
            {/* Barcode-like decoration */}
            <View style={styles.barcodeRow}>
              {Array.from({ length: 28 }, (_, i) => (
                <View key={i} style={[styles.barcodeLine, { height: i % 3 === 0 ? 24 : i % 2 === 0 ? 18 : 12 }]} />
              ))}
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>RESERVATION DETAILS</Text>
            {[
              { icon: 'silverware-fork-knife', label: 'Restaurant', value: booking.restaurantName },
              { icon: 'calendar-outline', label: 'Date', value: booking.date },
              { icon: 'clock-outline', label: 'Time', value: booking.time },
              { icon: 'account-group-outline', label: 'Guests', value: `${booking.seats} ${booking.seats === 1 ? 'person' : 'persons'}` },
              {
                icon: 'cash-check', label: 'Payment',
                value: booking.paymentStatus === 'paid'
                  ? `Paid  ₹${booking.totalAmount.toLocaleString()}`
                  : 'Pay at restaurant',
              },
            ].map((item, idx, arr) => (
              <View key={item.label} style={[styles.detailRow, idx === arr.length - 1 && styles.detailRowLast]}>
                <View style={styles.detailLeft}>
                  <Icon name={item.icon} size={15} color={Colors.gold} />
                  <Text style={styles.detailLabel}>{item.label}</Text>
                </View>
                <Text style={[
                  styles.detailValue,
                  item.label === 'Payment' && booking.paymentStatus === 'paid' && styles.detailValueGreen,
                ]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Notification note */}
          <View style={styles.notifCard}>
            <Icon name="bell-ring-outline" size={16} color={Colors.gold} />
            <Text style={styles.notifText}>
              A confirmation has been sent to <Text style={{ fontWeight: '700' }}>SMS & Email</Text> registered with your account.
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Icon name="share-variant-outline" size={16} color={Colors.textPrimary} />
            <Text style={styles.shareBtnText}>SHARE BOOKING</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtn} onPress={goHome} activeOpacity={0.85}>
            <Text style={styles.homeBtnText}>BACK TO HOME</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  topSection: {
    backgroundColor: Colors.bgDark, paddingTop: 60, paddingBottom: 36,
    alignItems: 'center', gap: 12,
  },
  checkCircle: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: Colors.gold,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#F8F5F0' },
  successSub: { fontSize: 13, color: '#78716C' },

  scroll: { padding: 20, paddingBottom: 40 },

  codeCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    marginBottom: 16, ...Shadow.md,
  },
  codeLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2, marginBottom: 10 },
  codeValue: {
    fontSize: 36, fontWeight: '700', color: Colors.textPrimary,
    letterSpacing: 6, marginBottom: 6,
  },
  codeHint: { fontSize: 11, color: Colors.textMuted, marginBottom: 20 },
  barcodeRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 2.5,
    paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border, width: '100%', justifyContent: 'center',
  },
  barcodeLine: { width: 2.5, backgroundColor: Colors.border, borderRadius: 1 },

  detailsCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 14, ...Shadow.sm,
  },
  detailsTitle: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 14 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 13, color: Colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, maxWidth: '55%', textAlign: 'right' },
  detailValueGreen: { color: Colors.success },

  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FEF9EC', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: Colors.goldLight, marginBottom: 20,
  },
  notifText: { fontSize: 12, color: Colors.textSecondary, flex: 1, lineHeight: 18 },

  shareBtn: {
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.bgDark, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  shareBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 1.5 },
  homeBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 10, paddingVertical: 16,
    alignItems: 'center',
  },
  homeBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textInverse, letterSpacing: 1.5 },
});

export default ConfirmationScreen;
