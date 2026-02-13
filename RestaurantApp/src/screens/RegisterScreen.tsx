import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'All fields are required' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (phone.length < 10) {
      Toast.show({ type: 'error', text1: 'Enter a valid phone number' });
      return;
    }
    setLoading(true);
    const result = await register(name.trim(), email.trim(), phone.trim(), password);
    setLoading(false);
    if (!result.success) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: result.message });
    }
  };

  const Field = ({ label, icon, value, onChange, placeholder, keyboard = 'default', secure = false }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color="#8B7BA8" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor="#4A3D6B"
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard}
          autoCapitalize="none"
          secureTextEntry={secure && !showPassword}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8B7BA8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join TableVault and start booking</Text>
        </View>

        <View style={styles.card}>
          <Field label="Full Name" icon="account-outline" value={name} onChange={setName} placeholder="John Doe" />
          <Field label="Email Address" icon="email-outline" value={email} onChange={setEmail} placeholder="you@example.com" keyboard="email-address" />
          <Field label="Phone Number" icon="phone-outline" value={phone} onChange={setPhone} placeholder="9876543210" keyboard="phone-pad" />
          <Field label="Password" icon="lock-outline" value={password} onChange={setPassword} placeholder="Create a strong password" secure={true} />
          <Field label="Confirm Password" icon="lock-check-outline" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter password" secure={true} />

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.registerBtnText}>Create Account</Text>
                <Icon name="account-plus" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E' },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 },
  backBtn: { marginTop: 50, marginBottom: 10, alignSelf: 'flex-start', padding: 4 },
  header: { paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#8B7BA8', marginTop: 4 },
  card: { backgroundColor: '#231040', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#2D1B69' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, color: '#C4B5E0', fontWeight: '600', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A0A2E',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4,
    borderWidth: 1, borderColor: '#3D2B80',
  },
  inputIcon: { marginRight: 10 },
  input: { color: '#FFFFFF', fontSize: 15, paddingVertical: 12 },
  registerBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8,
  },
  registerBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#8B7BA8', fontSize: 14 },
  footerLink: { color: '#FF6B35', fontSize: 14, fontWeight: '700' },
});

export default RegisterScreen;
