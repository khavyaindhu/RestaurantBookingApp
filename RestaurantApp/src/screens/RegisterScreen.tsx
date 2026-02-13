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
      Toast.show({ type: 'error', text1: 'All fields are required' }); return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' }); return;
    }
    if (phone.length < 10) {
      Toast.show({ type: 'error', text1: 'Enter a valid phone number' }); return;
    }
    setLoading(true);
    const result = await register(name.trim(), email.trim(), phone.trim(), password);
    setLoading(false);
    if (!result.success) Toast.show({ type: 'error', text1: 'Registration Failed', text2: result.message });
  };

  interface FieldProps {
    label: string; icon: string; value: string; onChange: (v: string) => void;
    placeholder: string; keyboard?: any; secure?: boolean;
  }
  const Field = ({ label, icon, value, onChange, placeholder, keyboard = 'default', secure = false }: FieldProps) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <Icon name={icon} size={16} color={Colors.textMuted} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard}
          autoCapitalize="none"
          secureTextEntry={secure && !showPassword}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.topBarTitle}>
            <Text style={styles.topBarBrand}>TableVault</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.formWrap}>
          <Text style={styles.pageTitle}>Create account</Text>
          <Text style={styles.pageSub}>Join TableVault and start booking</Text>

          <Field label="FULL NAME" icon="account-outline" value={name} onChange={setName} placeholder="John Doe" />
          <Field label="EMAIL ADDRESS" icon="email-outline" value={email} onChange={setEmail} placeholder="you@example.com" keyboard="email-address" />
          <Field label="PHONE NUMBER" icon="phone-outline" value={phone} onChange={setPhone} placeholder="9876543210" keyboard="phone-pad" />
          <Field label="PASSWORD" icon="lock-outline" value={password} onChange={setPassword} placeholder="Create a strong password" secure />
          <Field label="CONFIRM PASSWORD" icon="lock-check-outline" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter password" secure />

          <TouchableOpacity style={styles.ctaBtn} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color={Colors.bgDark} />
              : <Text style={styles.ctaBtnText}>CREATE ACCOUNT</Text>
            }
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?  </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    backgroundColor: Colors.bg, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  topBarTitle: { alignItems: 'center' },
  topBarBrand: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 3 },
  formWrap: { paddingHorizontal: 28, paddingTop: 32, paddingBottom: 48 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  pageSub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 32, lineHeight: 20 },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.2, marginBottom: 8 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  input: { fontSize: 14, color: Colors.textPrimary },
  ctaBtn: {
    backgroundColor: Colors.bgDark, borderRadius: 10, paddingVertical: 16,
    alignItems: 'center', marginTop: 8, marginBottom: 24,
  },
  ctaBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textInverse, letterSpacing: 2 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, fontWeight: '700', color: Colors.bgDark, textDecorationLine: 'underline' },
});

export default RegisterScreen;
