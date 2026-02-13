import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { getUserBookings } = useBooking();

  const bookings = getUserBookings(user?.id || '');
  const confirmed = bookings.filter(b => b.bookingStatus === 'confirmed').length;
  const completed = bookings.filter(b => b.bookingStatus === 'completed').length;
  const totalPaid = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const MenuItem = ({ icon, label, value, color = '#8B7BA8' }: any) => (
    <View style={styles.menuItem}>
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userPhone}>{user?.phone}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', val: bookings.length, icon: 'calendar-check', color: '#8B7BA8' },
          { label: 'Active', val: confirmed, icon: 'calendar-clock', color: '#4CAF50' },
          { label: 'Spent', val: `₹${totalPaid.toLocaleString()}`, icon: 'cash', color: '#FF6B35' },
        ].map(s => (
          <View key={s.label} style={styles.statBox}>
            <Icon name={s.icon} size={22} color={s.color} />
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <MenuItem icon="account" label="Full Name" value={user?.name} color="#FF6B35" />
        <MenuItem icon="email-outline" label="Email" value={user?.email} color="#3F80FF" />
        <MenuItem icon="phone-outline" label="Phone" value={user?.phone} color="#4CAF50" />
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <MenuItem icon="information-outline" label="App Version" value="1.0.0" color="#8B7BA8" />
        <MenuItem icon="shield-check-outline" label="Privacy Policy" color="#8B7BA8" />
        <MenuItem icon="file-document-outline" label="Terms of Service" color="#8B7BA8" />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#FF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>TableVault v1.0 · Made with ❤️ in India</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E' },
  scroll: { paddingBottom: 30 },
  profileHeader: {
    alignItems: 'center', paddingTop: 60, paddingBottom: 28, paddingHorizontal: 20,
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#FF6B35',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    borderWidth: 3, borderColor: '#FF6B3580',
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  userName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#8B7BA8', marginBottom: 2 },
  userPhone: { fontSize: 14, color: '#8B7BA8' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1, backgroundColor: '#231040', borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#2D1B69',
  },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#8B7BA8', fontSize: 12 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: '#8B7BA8', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#231040',
    borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#2D1B69', gap: 12,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, color: '#FFFFFF', fontSize: 14 },
  menuValue: { color: '#8B7BA8', fontSize: 13 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16,
    backgroundColor: '#FF444420', borderRadius: 14, paddingVertical: 16,
    justifyContent: 'center', borderWidth: 1, borderColor: '#FF444440', marginBottom: 20,
  },
  logoutText: { color: '#FF4444', fontWeight: '700', fontSize: 15 },
  footer: { color: '#4A3D6B', textAlign: 'center', fontSize: 12 },
});

export default ProfileScreen;
