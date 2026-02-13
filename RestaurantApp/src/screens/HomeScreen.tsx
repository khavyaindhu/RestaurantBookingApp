import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Image, ScrollView, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useBooking, Restaurant } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const CUISINES = ['All', 'Indian', 'Japanese', 'Italian', 'Chinese', 'Continental'];

const RestaurantCard = ({ restaurant, onPress }: { restaurant: Restaurant; onPress: () => void }) => {
  const seatColor = restaurant.availableSeats <= 15 ? '#FF4444' :
    restaurant.availableSeats <= 30 ? '#FFA500' : '#4CAF50';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: restaurant.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      {/* Seat Badge */}
      <View style={[styles.seatBadge, { backgroundColor: seatColor + '22', borderColor: seatColor }]}>
        <Icon name="seat" size={12} color={seatColor} />
        <Text style={[styles.seatBadgeText, { color: seatColor }]}>
          {restaurant.availableSeats} seats free
        </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingPill}>
            <Icon name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>
        <View style={styles.cardMeta}>
          <Icon name="food-variant" size={14} color="#8B7BA8" />
          <Text style={styles.metaText}>{restaurant.cuisine}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{restaurant.priceRange}</Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.locationRow}>
            <Icon name="map-marker-outline" size={13} color="#8B7BA8" />
            <Text style={styles.addressText} numberOfLines={1}>{restaurant.address}</Text>
          </View>
          <View style={styles.timeRow}>
            <Icon name="clock-outline" size={13} color="#8B7BA8" />
            <Text style={styles.timeText}>{restaurant.openTime} - {restaurant.closeTime}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={onPress}>
          <Text style={styles.bookBtnText}>Reserve Now</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

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

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0A2E" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>Find your perfect table</Text>
        </View>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#8B7BA8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants or cuisine..."
          placeholderTextColor="#4A3D6B"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon name="close-circle" size={18} color="#8B7BA8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Cuisine Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
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

      {/* Results Count */}
      <Text style={styles.resultCount}>
        {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} found
      </Text>

      {/* Restaurant List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={() => handleSelectRestaurant(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="silverware-variant" size={50} color="#3D2B80" />
            <Text style={styles.emptyText}>No restaurants found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  subGreeting: { fontSize: 13, color: '#8B7BA8', marginTop: 2 },
  avatarBox: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF6B35',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#231040',
    marginHorizontal: 20, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: '#2D1B69', gap: 10, marginBottom: 12,
  },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14 },
  filterRow: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#231040', borderWidth: 1, borderColor: '#2D1B69',
  },
  filterChipActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  filterChipText: { color: '#8B7BA8', fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#FFFFFF' },
  resultCount: { paddingHorizontal: 20, color: '#8B7BA8', fontSize: 13, marginBottom: 8 },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: '#231040', borderRadius: 18, marginBottom: 16,
    borderWidth: 1, borderColor: '#2D1B69', overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 160 },
  seatBadge: {
    position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center',
    gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  seatBadgeText: { fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', flex: 1 },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#1A0A2E', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  ratingText: { color: '#FFD700', fontSize: 12, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  metaText: { color: '#8B7BA8', fontSize: 13 },
  metaDot: { color: '#4A3D6B', fontSize: 13 },
  cardFooter: { gap: 4, marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressText: { color: '#8B7BA8', fontSize: 12, flex: 1 },
  timeText: { color: '#8B7BA8', fontSize: 12 },
  bookBtn: {
    backgroundColor: '#FF6B35', borderRadius: 10, paddingVertical: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  bookBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: '#4A3D6B', fontSize: 16 },
});

export default HomeScreen;
