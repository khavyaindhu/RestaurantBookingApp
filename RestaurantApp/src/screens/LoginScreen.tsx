import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: result.message });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Icon name="silverware-fork-knife" size={40} color="#FF6B35" />
          </View>
          <Text style={styles.appName}>TableVault</Text>
          <Text style={styles.tagline}>Your table awaits</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to manage your reservations</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Icon name="email-outline" size={20} color="#8B7BA8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#4A3D6B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock-outline" size={20} color="#8B7BA8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter password"
                placeholderTextColor="#4A3D6B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8B7BA8" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Demo hint */}
          <View style={styles.demoBox}>
            <Icon name="information-outline" size={16} color="#FF6B35" />
            <Text style={styles.demoText}>Demo: john@example.com / password123</Text>
          </View>
        </View>

        {/* Register Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E' },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
  logoBox: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#2D1B69',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FF6B35',
  },
  appName: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', marginTop: 16, letterSpacing: 2 },
  tagline: { fontSize: 13, color: '#8B7BA8', marginTop: 4 },
  card: {
    backgroundColor: '#231040', borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: '#2D1B69',
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  cardSubtitle: { fontSize: 13, color: '#8B7BA8', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: '#C4B5E0', fontWeight: '600', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A0A2E',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4,
    borderWidth: 1, borderColor: '#3D2B80',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 12 },
  loginBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 8, marginTop: 8,
  },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  demoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1A0A2E', borderRadius: 8, padding: 10, marginTop: 16,
    borderWidth: 1, borderColor: '#FF6B3540',
  },
  demoText: { fontSize: 12, color: '#FF6B35' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#8B7BA8', fontSize: 14 },
  footerLink: { color: '#FF6B35', fontSize: 14, fontWeight: '700' },
});

export default LoginScreen;
