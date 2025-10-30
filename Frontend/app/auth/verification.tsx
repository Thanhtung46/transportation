import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { authService } from '../../src/services/authService';
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

export default function VerificationScreen() {
  const [codes, setCodes] = useState(['', '', '', '']);
  const [displayCodes, setDisplayCodes] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  // Nhận email từ params
  const params = useLocalSearchParams();
  const email = params.email as string;

  const handleCodeChange = (text: string, index: number) => {
    // Filter out non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');

    // Only allow single digit
    const finalText = numericText.slice(0, 1);

    const newCodes = [...codes];
    const newDisplayCodes = [...displayCodes];
    newCodes[index] = finalText;
    newDisplayCodes[index] = finalText ? '●' : '';
    setCodes(newCodes);
    setDisplayCodes(newDisplayCodes);

    // Auto focus next input
    if (finalText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto blur when all fields filled
    if (index === 3 && finalText) {
      Keyboard.dismiss();
    }
  };

  const handleCodeKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (codes[index]) {
        // Clear current field if it has a value
        const newCodes = [...codes];
        const newDisplayCodes = [...displayCodes];
        newCodes[index] = '';
        newDisplayCodes[index] = '';
        setCodes(newCodes);
        setDisplayCodes(newDisplayCodes);
      } else if (index > 0) {
        // Move to previous field if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleContinue = async () => {
    const code = codes.join('');
    
    if (code.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số');
      return;
    }

    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin email');
      return;
    }

    setIsLoading(true);

    try {
      const verificationData = {
        email,
        code,
      };

      // Gọi API xác thực OTP
      const response = await authService.verifyCode(verificationData);
      
      console.log('Verification success:', response);
      
      // Lưu token nếu API trả về
      // if (response.token) {
      //   await AsyncStorage.setItem('authToken', response.token);
      // }

      // Chuyển đến màn hình nhập thông tin cá nhân
      router.push('/auth/personal-data');

    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert(
        'Lỗi xác thực', 
        error.message || 'Mã xác thực không đúng. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Không tìm thấy email');
      return;
    }

    try {
      await authService.resendCode(email);
      Alert.alert('Thành công', 'Đã gửi lại mã xác thực');
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể gửi lại mã. Vui lòng thử lại.');
    }
  };

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
        <Text style={styles.title}>Xác thực</Text>

        {/* Instruction text */}
        <Text style={styles.instructionText}>
          Chúng tôi đã gửi mã xác thực đến email {email || 'của bạn'}, hãy nhập mã để tiếp tục!
        </Text>

        {/* Code input fields */}
        <View style={styles.codeContainer}>
          {codes.map((code, index) => (
            <View key={index} style={styles.codeInputWrapper}>
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.codeInput}
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

        {/* Resend code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Không nhận được mã? </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
            <Text style={styles.resendLink}>Gửi lại mã</Text>
          </TouchableOpacity>
        </View>

        {/* Continue button */}
        <View style={styles.buttonContainer}>
          <GradientButton 
            title={isLoading ? "Đang xác thực..." : "Tiếp tục"} 
            onPress={handleContinue}
            disabled={isLoading}
          />
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
    paddingTop: Platform.OS === 'android' ? 24 : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.gradientPurple,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.light.gray,
    marginBottom: 40,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeInputWrapper: {
    width: 70,
    height: 70,
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
    fontSize: 28,
    fontWeight: '600',
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
    position: 'absolute',
  },
  codePlaceholder: {
    width: 20,
    height: 2,
    backgroundColor: Colors.light.lightGray,
    position: 'absolute',
    borderRadius: 1,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
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
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 30,
  },
});