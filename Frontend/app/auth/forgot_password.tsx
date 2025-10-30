// app/(auth)/forgot-password.tsx - CẬP NHẬT
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import GradientButton from '../../src/components/GradientButton';
import { Colors } from '../../src/constants/theme';
import { authService } from '../../src/services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email của bạn');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.sendForgotPasswordOTP(email);
      
      console.log('Send OTP success:', response);
      setOtpSent(true);
      
      // Chuyển đến màn hình nhập OTP
      router.push({
        pathname: '/auth/verify-otp',
        params: { 
          email: email,
          purpose: 'forgot-password'
        }
      });
      
    } catch (error: any) {
      console.error('Send OTP error:', error);
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Quên mật khẩu</Text>

          {/* Instruction */}
          <Text style={styles.instruction}>
            Nhập email của bạn để nhận mã OTP reset mật khẩu
          </Text>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.light.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email của bạn"
                placeholderTextColor={Colors.light.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Send OTP Button */}
          <View style={styles.buttonContainer}>
            <GradientButton 
              title={isLoading ? "Đang gửi..." : "Gửi mã OTP"} 
              onPress={handleSendOTP}
              disabled={isLoading}
            />
          </View>

          {/* Back to Login */}
          <View style={styles.loginContainer}>
            <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
              <Text style={styles.loginLink}>Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Giữ nguyên styles như cũ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.gradientPurple,
    marginBottom: 16,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: Colors.light.gray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.gray,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.light.gradientPurple,
    fontWeight: '500',
  },
});