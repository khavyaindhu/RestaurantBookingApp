import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Colors, Shadow } from '../utils/theme';

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
    if (!result.success) Toast.show({ type: 'error', text1: 'Login Failed', text2: result.message });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header band */}
        <View style={styles.topBand}>
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>TV</Text>
          </View>
          <Text style={styles.brandName}>TableVault</Text>
          <Text style={styles.brandSub}>FINE DINING · RESERVATIONS</Text>
        </View>

        <View style={styles.formWrap}>
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSub}>Sign in to manage your reservations</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputBox}>
              <Icon name="email-outline" size={16} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={styles.inputBox}>
              <Icon name="lock-outline" size={16} color={Colors.textMuted} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo hint */}
          <View style={styles.hintBox}>
            <Icon name="information-outline" size={14} color={Colors.gold} />
            <Text style={styles.hintText}>Demo: john@example.com  /  password123</Text>
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color={Colors.bgDark} />
              : <Text style={styles.ctaBtnText}>SIGN IN</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Register')} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>CREATE AN ACCOUNT</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1 },

  topBand: {
    backgroundColor: Colors.bgDark,
    paddingTop: 60, paddingBottom: 40,
    alignItems: 'center', gap: 10,
  },
  monogram: {
    width: 56, height: 56, borderRadius: 4,
    borderWidth: 1.5, borderColor: Colors.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  monogramText: { fontSize: 18, fontWeight: '300', color: Colors.gold, letterSpacing: 4 },
  brandName: { fontSize: 22, fontWeight: '300', color: '#F8F5F0', letterSpacing: 6 },
  brandSub: { fontSize: 9, fontWeight: '600', color: Colors.gold, letterSpacing: 2.5 },

  formWrap: { flex: 1, paddingHorizontal: 28, paddingTop: 36, paddingBottom: 40 },
  welcomeTitle: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  welcomeSub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 32, lineHeight: 20 },

  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.2, marginBottom: 8 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
  },
  input: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  hintBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FEF9EC', borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: Colors.goldLight, marginBottom: 24,
  },
  hintText: { fontSize: 12, color: Colors.warning },

  ctaBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 10, paddingVertical: 16,
    alignItems: 'center', marginBottom: 20,
  },
  ctaBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textInverse, letterSpacing: 2 },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1 },

  secondaryBtn: {
    borderRadius: 10, paddingVertical: 15,
    alignItems: 'center', borderWidth: 1.5, borderColor: Colors.bgDark,
  },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: Colors.bgDark, letterSpacing: 2 },
});

export default LoginScreen;
