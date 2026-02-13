import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Colors, Shadow } from '../utils/theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { getUserBookings } = useBooking();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const bookings = getUserBookings(user?.id || '');
  const confirmed = bookings.filter(b => b.bookingStatus === 'confirmed').length;
  const totalPaid = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  interface RowProps { icon: string; label: string; value?: string; danger?: boolean; onPress?: () => void; }
  const MenuRow = ({ icon, label, value, danger, onPress }: RowProps) => (
    <TouchableOpacity
      style={styles.menuRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Icon name={icon} size={17} color={danger ? Colors.danger : Colors.textSecondary} />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {onPress && <Icon name="chevron-right" size={16} color={Colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle]}>
            <Text style={[styles.statValue, { color: Colors.success }]}>{confirmed}</Text>
            <Text style={styles.statLabel}>ACTIVE</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.gold }]}>
              ₹{totalPaid > 0 ? (totalPaid / 1000).toFixed(1) + 'k' : '0'}
            </Text>
            <Text style={styles.statLabel}>SPENT</Text>
          </View>
        </View>

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.menuCard}>
            <MenuRow icon="account-outline" label="Full Name" value={user?.name} />
            <View style={styles.menuDivider} />
            <MenuRow icon="email-outline" label="Email" value={user?.email} />
            <View style={styles.menuDivider} />
            <MenuRow icon="phone-outline" label="Phone" value={user?.phone} />
          </View>
        </View>

        {/* App section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APP</Text>
          <View style={styles.menuCard}>
            <MenuRow icon="bell-outline" label="Notifications" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuRow icon="shield-outline" label="Privacy Policy" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuRow icon="file-document-outline" label="Terms of Service" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuRow icon="information-outline" label="Version" value="1.0.0" />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuRow icon="logout" label="Sign Out" danger onPress={() => setShowLogoutModal(true)} />
          </View>
        </View>

        <Text style={styles.footer}>TableVault  ·  Made with care in India</Text>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Icon name="logout" size={28} color={Colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>Are you sure you want to sign out?</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn} 
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmBtn} 
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: 40 },
  hero: {
    backgroundColor: Colors.bgDark, alignItems: 'center',
    paddingTop: 54, paddingBottom: 32, paddingHorizontal: 20,
  },
  avatarRing: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2, borderColor: Colors.gold,
    padding: 3, marginBottom: 14,
  },
  avatar: {
    flex: 1, borderRadius: 42, backgroundColor: Colors.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: Colors.bgDark },
  userName: { fontSize: 20, fontWeight: '700', color: '#F8F5F0', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#78716C', marginBottom: 2 },
  userPhone: { fontSize: 13, color: '#78716C' },

  statsRow: {
    flexDirection: 'row', marginHorizontal: 20, marginTop: -1,
    backgroundColor: Colors.surface, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, marginBottom: 24, ...Shadow.md,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statCardMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  statLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1 },

  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 10 },
  menuCard: {
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', ...Shadow.sm,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15, gap: 12 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 9, backgroundColor: Colors.surfaceWarm,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  menuIconDanger: { backgroundColor: Colors.dangerBg, borderColor: Colors.dangerBg },
  menuLabel: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  menuLabelDanger: { color: Colors.danger },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { fontSize: 13, color: Colors.textMuted, maxWidth: 150 },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 64 },

  footer: { textAlign: 'center', fontSize: 11, color: Colors.textMuted, letterSpacing: 0.5 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...Shadow.lg,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.danger,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default ProfileScreen;