import React from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useBooking } from '../context/BookingContext';
import { Colors, Shadow } from '../utils/theme';

const RestaurantDetailScreen = () => {
  const navigation = useNavigation<any>();
  const { selectedRestaurant } = useBooking();
  const r = selectedRestaurant;
  if (!r) return null;

  const pct = Math.round((r.availableSeats / r.totalSeats) * 100);
  const seatColor = pct <= 20 ? Colors.danger : pct <= 50 ? Colors.warning : Colors.success;
  const statusMsg = pct === 0 ? 'Fully Booked' : pct <= 20 ? 'Almost Full — Book soon' : pct <= 50 ? 'Filling up fast' : 'Good availability';

  const InfoChip = ({ icon, label }: { icon: string; label: string }) => (
    <View style={styles.infoChip}>
      <Icon name={icon} size={15} color={Colors.gold} />
      <Text style={styles.infoChipText}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: r.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroGradient} />

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#F8F5F0" />
          </TouchableOpacity>

          {/* Hero Text */}
          <View style={styles.heroText}>
            <View style={styles.cuisineBadge}>
              <Text style={styles.cuisineBadgeText}>{r.cuisine.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroName}>{r.name}</Text>
            <View style={styles.heroMeta}>
              <Icon name="star" size={13} color="#FFD700" />
              <Text style={styles.heroMetaText}>{r.rating}  ·  {r.priceRange}  ·  {r.openTime}–{r.closeTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Seat Availability */}
          <View style={styles.seatCard}>
            <View style={styles.seatCardHeader}>
              <Text style={styles.sectionTitle}>Seat Availability</Text>
              <Text style={[styles.seatStatus, { color: seatColor }]}>{statusMsg}</Text>
            </View>

            {/* Numbers */}
            <View style={styles.seatNumbers}>
              <View style={styles.seatStat}>
                <Text style={[styles.seatNum, { color: seatColor }]}>{r.availableSeats}</Text>
                <Text style={styles.seatNumLabel}>Available</Text>
              </View>
              <View style={styles.seatStatDivider} />
              <View style={styles.seatStat}>
                <Text style={styles.seatNum}>{r.totalSeats - r.availableSeats}</Text>
                <Text style={styles.seatNumLabel}>Occupied</Text>
              </View>
              <View style={styles.seatStatDivider} />
              <View style={styles.seatStat}>
                <Text style={styles.seatNum}>{r.totalSeats}</Text>
                <Text style={styles.seatNumLabel}>Total</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: seatColor }]} />
            </View>
            <Text style={styles.progressLabel}>{pct}% available</Text>
          </View>

          {/* Info chips */}
          <View style={styles.infoRow}>
            <InfoChip icon="clock-outline" label={`${r.openTime} – ${r.closeTime}`} />
            <InfoChip icon="phone-outline" label={r.phone} />
          </View>

          {/* Address */}
          <View style={styles.addressRow}>
            <Icon name="map-marker-outline" size={16} color={Colors.gold} />
            <Text style={styles.addressText}>{r.address}</Text>
          </View>

          {/* Divider */}
          <View style={styles.sectionDivider} />

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{r.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>AVAILABILITY</Text>
          <Text style={[styles.bottomValue, { color: seatColor }]}>{r.availableSeats} seats free</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, r.availableSeats === 0 && styles.bookBtnDisabled]}
          onPress={() => navigation.navigate('Booking')}
          disabled={r.availableSeats === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>
            {r.availableSeats === 0 ? 'FULLY BOOKED' : 'RESERVE A TABLE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { height: 320, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Simulated gradient via multiple overlays
  },
  backBtn: {
    position: 'absolute', top: 52, left: 18,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(28,25,23,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  heroText: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  cuisineBadge: {
    alignSelf: 'flex-start', backgroundColor: Colors.gold,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 3, marginBottom: 8,
  },
  cuisineBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.bgDark, letterSpacing: 1.5 },
  heroName: { fontSize: 26, fontWeight: '700', color: '#F8F5F0', marginBottom: 6, lineHeight: 30 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { fontSize: 13, color: 'rgba(248,245,240,0.8)' },

  content: { paddingHorizontal: 20, paddingTop: 20 },
  seatCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  seatCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  seatStatus: { fontSize: 12, fontWeight: '600' },
  seatNumbers: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 18 },
  seatStat: { alignItems: 'center' },
  seatNum: { fontSize: 30, fontWeight: '700', color: Colors.textPrimary },
  seatNumLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2, fontWeight: '500' },
  seatStatDivider: { width: 1, backgroundColor: Colors.border },
  progressTrack: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'right' },

  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  infoChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  infoChipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', flex: 1 },
  addressRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.surface, borderRadius: 10, padding: 12, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  addressText: { fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
  sectionDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 20 },
  aboutText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Shadow.lg,
  },
  bottomLeft: {},
  bottomLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.2, marginBottom: 2 },
  bottomValue: { fontSize: 15, fontWeight: '700' },
  bookBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  bookBtnDisabled: { backgroundColor: Colors.textMuted },
  bookBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textInverse, letterSpacing: 1.5 },
});

export default RestaurantDetailScreen;
