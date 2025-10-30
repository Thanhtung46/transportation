// app/(auth)/verify-otp.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Keyboard,
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

export default function VerifyOTPScreen() {
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [displayCodes, setDisplayCodes] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  // SỬ DỤNG useRef ĐỂ THEO DÕI OTP REAL-TIME
  const otpRef = useRef(['', '', '', '', '', '']);

  // Nhận email từ params
  const params = useLocalSearchParams();
  const email = params.email as string;
  const purpose = params.purpose as string; // 'forgot-password'

  const handleCodeChange = (text: string, index: number) => {
    console.log(`🔢 [DEBUG] handleCodeChange - index: ${index}, text: "${text}"`);
    
    const numericText = text.replace(/[^0-9]/g, '');
    const finalText = numericText.slice(0, 1);

    // CẬP NHẬT REF NGAY LẬP TỨC (sync)
    otpRef.current[index] = finalText;
    
    console.log(`🔢 [DEBUG] OTP Ref updated:`, otpRef.current);

    // Cập nhật state cho UI (async)
    const newCodes = [...otpRef.current];
    const newDisplayCodes = newCodes.map(code => code ? '●' : '');
    
    setCodes(newCodes);
    setDisplayCodes(newDisplayCodes);

    // Auto focus next input
    if (finalText && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }

    // Xử lý paste OTP (nếu người dùng paste 6 số)
    if (text.length > 1) {
      console.log(`🔢 [DEBUG] Paste detected: "${text}"`);
      handlePasteOTP(text);
    }

    // **KHÔNG CÓ AUTO-VERIFY Ở ĐÂY** - Chỉ manual verification
  };

  const handlePasteOTP = (pastedText: string) => {
    const numericText = pastedText.replace(/[^0-9]/g, '').slice(0, 6);
    
    if (numericText.length === 6) {
      console.log(`🔢 [DEBUG] Processing paste: ${numericText}`);
      
      // Cập nhật ref
      otpRef.current = numericText.split('');
      
      // Cập nhật state
      const newCodes = [...otpRef.current];
      const newDisplayCodes = newCodes.map(() => '●');
      
      setCodes(newCodes);
      setDisplayCodes(newDisplayCodes);
      Keyboard.dismiss();
      
      // **KHÔNG TỰ ĐỘNG VERIFY KHI PASTE** - Chỉ manual
    }
  };

  const handleCodeKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      // Cập nhật ref
      otpRef.current[index] = '';
      
      // Cập nhật state
      const newCodes = [...otpRef.current];
      const newDisplayCodes = newCodes.map(code => code ? '●' : '');
      
      setCodes(newCodes);
      setDisplayCodes(newDisplayCodes);

      // Move to previous field if current is empty
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const currentOTP = otpRef.current.join(''); // LUÔN DÙNG REF ĐỂ CÓ DATA MỚI NHẤT
    
    console.log(`🔐 [DEBUG] Manual verification - OTP: "${currentOTP}", length: ${currentOTP.length}`);
    console.log(`🔐 [DEBUG] Ref state:`, otpRef.current);
    
    if (currentOTP.length !== 6) {
      console.log(`❌ [DEBUG] OTP length invalid: ${currentOTP.length}`);
      
      // Tìm ô còn trống và focus vào đó
      const emptyIndex = otpRef.current.findIndex(code => code === '');
      if (emptyIndex !== -1) {
        inputRefs.current[emptyIndex]?.focus();
      }
      
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin email');
      return;
    }

    console.log(`✅ [DEBUG] OTP validation passed: ${currentOTP}`);
    
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      if (purpose === 'forgot-password') {
        const response = await authService.verifyForgotPasswordOTP(email, currentOTP);
        
        console.log('✅ Verify OTP success:', response);
        
        router.push({
          pathname: '/auth/reset-password',
          params: { email, otp: currentOTP }
        });
      }
      
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      Alert.alert('Lỗi xác thực', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy email');
      return;
    }

    try {
      // Reset OTP fields
      otpRef.current = ['', '', '', '', '', ''];
      setCodes(['', '', '', '', '', '']);
      setDisplayCodes(['', '', '', '', '', '']);
      
      await authService.sendForgotPasswordOTP(email);
      Alert.alert('Thành công', 'Đã gửi lại mã OTP');
      
      // Focus vào ô đầu tiên
      inputRefs.current[0]?.focus();
      
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  // Kiểm tra xem OTP đã đủ 6 số chưa (cho UI)
  const isOTPComplete = codes.every(code => code !== '');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Xác thực OTP</Text>

        {/* Instruction text */}
        <Text style={styles.instructionText}>
          Chúng tôi đã gửi mã OTP đến email{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* Code input fields */}
        <View style={styles.codeContainer}>
          {codes.map((code, index) => (
            <View key={index} style={styles.codeInputWrapper}>
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  isLoading && styles.codeInputDisabled,
                  isOTPComplete && styles.codeInputComplete
                ]}
                value={displayCodes[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleCodeKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus={false}
                editable={!isLoading}
              />
              {!code && <View style={styles.codePlaceholder} />}
            </View>
          ))}
        </View>

        {/* OTP Status */}
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            isOTPComplete ? styles.statusComplete : styles.statusIncomplete
          ]}>
            {isOTPComplete ? '✅ Đã nhập đủ 6 số' : `⏳ Đã nhập ${codes.filter(code => code !== '').length}/6 số`}
          </Text>
        </View>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Không nhận được mã? </Text>
          <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
            <Text style={[
              styles.resendLink,
              isLoading && styles.resendLinkDisabled
            ]}>
              Gửi lại mã
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Verify button - BẮT BUỘC PHẢI CLICK */}
        <View style={styles.buttonContainer}>
          <GradientButton 
            title={isLoading ? "Đang xác thực..." : "Xác thực OTP"} 
            onPress={handleVerifyOTP}
            disabled={isLoading || !isOTPComplete}
          />
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
             📝 Vui lòng nhập đủ 6 số OTP và nhấn nút &quot;Xác thực OTP&quot;
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.gradientPurple,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: Colors.light.gray,
    marginBottom: 40,
    lineHeight: 22,
    textAlign: 'center',
  },
  emailText: {
    fontWeight: '600',
    color: Colors.light.text,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  codeInputWrapper: {
    width: 50,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeInput: {
    width: '100%',
    height: '100%',
    borderWidth: 1.5,
    borderColor: Colors.light.lightGray,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
    position: 'absolute',
  },
  codeInputDisabled: {
    backgroundColor: Colors.light.lightGray,
    borderColor: Colors.light.gray,
  },
  codeInputComplete: {
    borderColor: Colors.light.gradientPurple,
  },
  codePlaceholder: {
    width: 15,
    height: 2,
    backgroundColor: Colors.light.lightGray,
    position: 'absolute',
    borderRadius: 1,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusComplete: {
    color: '#10B981', // green
  },
  statusIncomplete: {
    color: Colors.light.gray,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  resendText: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  resendLink: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: Colors.light.gray,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  noteContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  noteText: {
    fontSize: 12,
    color: Colors.light.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
});