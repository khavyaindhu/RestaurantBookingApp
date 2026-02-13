import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Image, ScrollView, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useBooking, Restaurant } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadow } from '../utils/theme';

const CUISINES = ['All', 'Indian', 'Japanese', 'Italian', 'Chinese', 'Continental'];

const SeatIndicator = ({ available, total }: { available: number; total: number }) => {
  const pct = (available / total) * 100;
  const color = pct <= 20 ? Colors.danger : pct <= 50 ? Colors.warning : Colors.success;
  const label = pct === 0 ? 'Full' : pct <= 20 ? 'Almost Full' : pct <= 50 ? 'Limited' : 'Available';
  return (
    <View style={[styles.seatPill, { backgroundColor: color + '18', borderColor: color + '50' }]}>
      <View style={[styles.seatDot, { backgroundColor: color }]} />
      <Text style={[styles.seatPillText, { color }]}>{available} seats · {label}</Text>
    </View>
  );
};

const RestaurantCard = ({ restaurant, onPress }: { restaurant: Restaurant; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
    <View style={styles.imageWrap}>
      <Image source={{ uri: restaurant.image }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.imageOverlay} />
      {/* Cuisine tag on image */}
      <View style={styles.cuisineTag}>
        <Text style={styles.cuisineTagText}>{restaurant.cuisine.toUpperCase()}</Text>
      </View>
      {/* Rating on image */}
      <View style={styles.ratingTag}>
        <Icon name="star" size={11} color="#FFD700" />
        <Text style={styles.ratingTagText}>{restaurant.rating}</Text>
      </View>
    </View>

    <View style={styles.cardBody}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardName}>{restaurant.name}</Text>
        <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
      </View>

      <View style={styles.cardMetaRow}>
        <Icon name="map-marker-outline" size={12} color={Colors.textMuted} />
        <Text style={styles.cardMeta} numberOfLines={1}>{restaurant.address}</Text>
        <Text style={styles.metaDivider}>·</Text>
        <Icon name="clock-outline" size={12} color={Colors.textMuted} />
        <Text style={styles.cardMeta}>{restaurant.openTime}–{restaurant.closeTime}</Text>
      </View>

      <View style={styles.cardFooterRow}>
        <SeatIndicator available={restaurant.availableSeats} total={restaurant.totalSeats} />
        <TouchableOpacity style={styles.reserveBtn} onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.reserveBtnText}>Reserve</Text>
          <Icon name="arrow-right" size={13} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const { restaurants, setSelectedRestaurant } = useBooking();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchText.toLowerCase());
    const matchCuisine = selectedCuisine === 'All' || r.cuisine === selectedCuisine;
    return matchSearch && matchCuisine;
  });

  const handleSelect = (r: Restaurant) => {
    setSelectedRestaurant(r);
    navigation.navigate('RestaurantDetail', { restaurantId: r.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening,</Text>
          <Text style={styles.userName}>{user?.name?.split(' ')[0]}</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Cuisine Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {CUISINES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.filterChip, selectedCuisine === c && styles.filterChipActive]}
            onPress={() => setSelectedCuisine(c)}
          >
            <Text style={[styles.filterChipText, selectedCuisine === c && styles.filterChipTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count row */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} restaurants</Text>
        <Text style={styles.countSub}>in Coimbatore</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} onPress={() => handleSelect(item)} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="silverware-variant" size={40} color={Colors.border} />
            <Text style={styles.emptyText}>No restaurants found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    backgroundColor: Colors.bgDark,
    paddingHorizontal: 24, paddingTop: 54, paddingBottom: 24,
  },
  greeting: { fontSize: 12, color: '#78716C', letterSpacing: 1, marginBottom: 2 },
  userName: { fontSize: 24, fontWeight: '700', color: '#F8F5F0' },
  avatarCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 17, fontWeight: '700', color: Colors.bgDark },
  searchWrap: { backgroundColor: Colors.bgDark, paddingHorizontal: 20, paddingBottom: 20 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#2C2926', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: '#3C3835',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#F8F5F0' },
  filterRow: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  filterChipActive: { backgroundColor: Colors.bgDark, borderColor: Colors.bgDark },
  filterChipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  filterChipTextActive: { color: '#F8F5F0' },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, paddingHorizontal: 24, paddingBottom: 4 },
  countText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  countSub: { fontSize: 13, color: Colors.textMuted },
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 18,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', ...Shadow.md,
  },
  imageWrap: { height: 180, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(28,25,23,0.25)' },
  cuisineTag: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(28,25,23,0.72)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4,
  },
  cuisineTagText: { fontSize: 9, fontWeight: '700', color: '#F8F5F0', letterSpacing: 1.5 },
  ratingTag: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(28,25,23,0.72)', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  ratingTagText: { fontSize: 12, fontWeight: '700', color: '#FFD700' },
  cardBody: { padding: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  priceRange: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14, flexWrap: 'wrap' },
  cardMeta: { fontSize: 12, color: Colors.textMuted },
  metaDivider: { color: Colors.border, marginHorizontal: 2 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seatPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1,
  },
  seatDot: { width: 6, height: 6, borderRadius: 3 },
  seatPillText: { fontSize: 11, fontWeight: '600' },
  reserveBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 9,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  reserveBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textInverse, letterSpacing: 0.5 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textMuted },
});

export default HomeScreen;
