import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 👈 Import useRouter
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

export default function PhoneScreen() {
  const router = useRouter(); // 👈 Initialize router
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    // Validation
    if (!phoneNumber) {
      setError("Please enter your mobile number");
      return;
    }
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API Call - Replace with Firebase/Auth logic later
    setTimeout(() => {
      setLoading(false);
      
      // 👇 Navigate to VerifyOTP screen with phone number parameter
      router.push({
        pathname: '/verify-otp',
        params: { phone: phoneNumber }
      });
      
      // Optional: Show success toast instead of Alert for smoother UX
      // Toast.show({ text: "OTP sent successfully!", type: "success" });
      
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Top Back Button - NOW WORKING ✅ */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()} // 👈 Back navigation enabled
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Enter Mobile Number</Text>
            <Text style={styles.subtitle}>
              We'll send a verification code to this number
            </Text>
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                placeholder="9876543210"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => { setPhoneNumber(text); setError(''); }}
                maxLength={10}
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSendOTP}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
            <Text style={styles.helpText}>
              Standard messaging rates may apply
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (keep all your existing styles exactly as they were)
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 10,
    padding: 8,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  form: {
    width: '100%',
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  countryCodeBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    marginRight: 10,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  countryCodeText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    color: '#111827',
    padding: 18,
    height: 56,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  button: {
    backgroundColor: '#F77F00',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#F77F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  helpText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
});