import React from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useBooking } from '../context/BookingContext';

const RestaurantDetailScreen = () => {
  const navigation = useNavigation<any>();
  const { selectedRestaurant } = useBooking();
  const r = selectedRestaurant;

  if (!r) return null;

  const seatColor = r.availableSeats <= 15 ? '#FF4444' :
    r.availableSeats <= 30 ? '#FFA500' : '#4CAF50';
  const seatPercent = Math.round((r.availableSeats / r.totalSeats) * 100);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.hero}>
          <Image source={{ uri: r.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroName}>{r.name}</Text>
            <View style={styles.heroMeta}>
              <Icon name="food-variant" size={14} color="#fff" />
              <Text style={styles.heroMetaText}>{r.cuisine}</Text>
              <Text style={styles.heroDot}>•</Text>
              <Icon name="star" size={14} color="#FFD700" />
              <Text style={styles.heroMetaText}>{r.rating}</Text>
              <Text style={styles.heroDot}>•</Text>
              <Text style={styles.heroMetaText}>{r.priceRange}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Seat Availability Card */}
          <View style={styles.seatCard}>
            <View style={styles.seatHeader}>
              <Icon name="seat-outline" size={20} color={seatColor} />
              <Text style={styles.seatTitle}>Seat Availability</Text>
            </View>
            <View style={styles.seatNumbers}>
              <View style={styles.seatStat}>
                <Text style={[styles.seatBig, { color: seatColor }]}>{r.availableSeats}</Text>
                <Text style={styles.seatLabel}>Available</Text>
              </View>
              <View style={styles.seatDivider} />
              <View style={styles.seatStat}>
                <Text style={styles.seatBig}>{r.totalSeats - r.availableSeats}</Text>
                <Text style={styles.seatLabel}>Booked</Text>
              </View>
              <View style={styles.seatDivider} />
              <View style={styles.seatStat}>
                <Text style={styles.seatBig}>{r.totalSeats}</Text>
                <Text style={styles.seatLabel}>Total</Text>
              </View>
            </View>
            {/* Progress bar */}
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${seatPercent}%`, backgroundColor: seatColor }]} />
            </View>
            <Text style={[styles.seatStatus, { color: seatColor }]}>
              {r.availableSeats <= 10 ? '🔥 Almost Full! Book now' :
                r.availableSeats <= 30 ? '⚡ Filling up fast' : '✅ Good availability'}
            </Text>
          </View>

          {/* Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Icon name="clock-outline" size={22} color="#FF6B35" />
              <Text style={styles.infoLabel}>Hours</Text>
              <Text style={styles.infoValue}>{r.openTime} - {r.closeTime}</Text>
            </View>
            <View style={styles.infoBox}>
              <Icon name="phone-outline" size={22} color="#FF6B35" />
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{r.phone}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Icon name="map-marker" size={18} color="#FF6B35" />
            <Text style={styles.sectionText}>{r.address}</Text>
          </View>

          {/* Description */}
          <View style={styles.descCard}>
            <Text style={styles.descTitle}>About</Text>
            <Text style={styles.descText}>{r.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.reserveBtn, r.availableSeats === 0 && styles.reserveBtnDisabled]}
          onPress={() => navigation.navigate('Booking')}
          disabled={r.availableSeats === 0}
        >
          <Icon name="calendar-plus" size={22} color="#fff" />
          <Text style={styles.reserveBtnText}>
            {r.availableSeats === 0 ? 'No Seats Available' : 'Book a Table'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E' },
  hero: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  backBtn: {
    position: 'absolute', top: 50, left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8,
  },
  heroContent: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  heroName: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroMetaText: { color: '#fff', fontSize: 13 },
  heroDot: { color: '#ffffff80', fontSize: 13 },
  content: { padding: 16 },
  seatCard: {
    backgroundColor: '#231040', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#2D1B69', marginBottom: 16,
  },
  seatHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  seatTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  seatNumbers: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  seatStat: { alignItems: 'center' },
  seatBig: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  seatLabel: { color: '#8B7BA8', fontSize: 12, marginTop: 2 },
  seatDivider: { width: 1, backgroundColor: '#2D1B69' },
  progressBg: { height: 6, backgroundColor: '#1A0A2E', borderRadius: 3, marginBottom: 10 },
  progressFill: { height: '100%', borderRadius: 3 },
  seatStatus: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoBox: {
    flex: 1, backgroundColor: '#231040', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#2D1B69', gap: 4,
  },
  infoLabel: { color: '#8B7BA8', fontSize: 11 },
  infoValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  section: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#231040', borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#2D1B69',
  },
  sectionText: { color: '#C4B5E0', fontSize: 14, flex: 1 },
  descCard: {
    backgroundColor: '#231040', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#2D1B69', marginBottom: 90,
  },
  descTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  descText: { color: '#8B7BA8', fontSize: 14, lineHeight: 22 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#1A0A2E', padding: 16,
    borderTopWidth: 1, borderTopColor: '#2D1B69',
  },
  reserveBtn: {
    backgroundColor: '#FF6B35', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  reserveBtnDisabled: { backgroundColor: '#4A3D6B' },
  reserveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default RestaurantDetailScreen;
