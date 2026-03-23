import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; // 👈 Added useRouter
import React, { useState, useEffect } from 'react';
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

export default function VerifyOTPScreen() {
  const router = useRouter(); // 👈 Initialize router
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);

  // Format phone for display (e.g., "+91 98765 43210")
  const formatPhone = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return num;
  };
  const phoneDisplay = phone ? formatPhone(phone.toString()) : 'your number';

  // Timer Logic for Resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !resending) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, resending]);

  const handleVerify = () => {
    // ✅ Part 1: OTP Validation Logic
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate Verification API Call
    setTimeout(() => {
      setLoading(false);
      
      // ✅ Part 2: Redirect to Home after success
      // Using 'replace' so user can't go back to OTP screen with back button
      router.replace('/(main)/home');
      
    }, 1500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    
    setResending(true);
    // Simulate Resend API
    setTimeout(() => {
      setResending(false);
      setTimer(30);
      setOtp('');
      Alert.alert("OTP Resent", "A new code has been sent to your number");
    }, 1000);
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
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {'\n'}{phoneDisplay}
            </Text>
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              placeholder="000000"
              placeholderTextColor="#9CA3AF"
              style={styles.otpInput}
              keyboardType="number-pad"
              value={otp}
              onChangeText={(text) => { 
                // Only allow digits
                const digits = text.replace(/\D/g, '');
                setOtp(digits); 
                setError(''); 
              }}
              maxLength={6}
              textAlign="center"
              textAlignVertical="center"
            />

            {/* Verify Button */}
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleVerify}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            {/* Resend Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity 
                onPress={handleResend} 
                disabled={timer > 0}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.resendLink, 
                  { opacity: timer > 0 ? 0.5 : 1 }
                ]}>
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  otpInput: {
    backgroundColor: '#F9FAFB',
    color: '#111827',
    padding: 18,
    height: 64,
    borderRadius: 12,
    marginBottom: 24,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendLink: {
    color: '#F77F00',
    fontSize: 14,
    fontWeight: '700',
  },
});