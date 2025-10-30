import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
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

export default function PersonalDataScreen() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    // Validation
    if (!name || !dateOfBirth || !location || !phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin cá nhân');
      return;
    }

    setIsLoading(true);

    try {
      const personalData = {
        name,
        gender,
        dateOfBirth,
        location,
        phoneNumber,
      };

      // Gọi API lưu thông tin cá nhân
      const response = await authService.savePersonalData(personalData);
      
      console.log('Save personal data success:', response);
      
      Alert.alert(
        'Thành công', 
        'Đăng ký tài khoản thành công!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Chuyển về màn hình đăng nhập
              router.replace('/auth/login');
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Save personal data error:', error);
      Alert.alert(
        'Lỗi', 
        error.message || 'Không thể lưu thông tin. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = () => {
    console.log('Open image picker');
    // Handle image picker logic here
  };

  const handleDatePicker = () => {
    console.log('Open date picker');
    // Handle date picker logic here
  };

  const handleLocationPicker = () => {
    console.log('Open location picker');
    // Handle location picker logic here
  };

  const handlePhoneCodePicker = () => {
    console.log('Open phone code picker');
    // Handle phone code picker logic here
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Thông tin cá nhân</Text>

          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <Ionicons name="person" size={60} color={Colors.light.lightGray} />
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker} disabled={isLoading}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={Colors.light.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập họ và tên của bạn"
                placeholderTextColor={Colors.light.gray}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
                onPress={() => setGender('male')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'male' && styles.genderButtonTextSelected,
                  ]}
                >
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
                onPress={() => setGender('female')}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'female' && styles.genderButtonTextSelected,
                  ]}
                >
                  Nữ
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity 
              style={styles.inputContainer} 
              onPress={handleDatePicker}
              disabled={isLoading}
            >
              <Ionicons name="calendar-outline" size={20} color={Colors.light.gray} style={styles.inputIcon} />
              <Text style={[styles.inputText, !dateOfBirth && { color: Colors.light.gray }]}>
                {dateOfBirth || 'Chọn ngày sinh'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.gray} style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TouchableOpacity 
              style={styles.inputContainer} 
              onPress={handleLocationPicker}
              disabled={isLoading}
            >
              <Ionicons name="location-outline" size={20} color={Colors.light.gray} style={styles.inputIcon} />
              <Text style={[styles.inputText, !location && { color: Colors.light.gray }]}>
                {location || 'Chọn địa chỉ'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map Placeholder */}
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={40} color={Colors.light.lightGray} />
              <TouchableOpacity style={styles.viewMapButton} disabled={isLoading}>
                <Text style={styles.viewMapText}>Xem bản đồ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.phoneContainer}>
              <TouchableOpacity
                style={styles.phoneCodeButton}
                onPress={handlePhoneCodePicker}
                disabled={isLoading}
              >
                <Text style={styles.phoneCodeText}>🇻🇳</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.light.gray} />
              </TouchableOpacity>
              <View style={[styles.inputContainer, styles.phoneInputContainer]}>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor={Colors.light.gray}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
            </View>
          </View>

          {/* Continue button */}
          <View style={styles.buttonContainer}>
            <GradientButton 
              title={isLoading ? "Đang lưu..." : "Hoàn tất"} 
              onPress={handleContinue}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.gradientPurple,
    marginBottom: 30,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.light.background,
  },
  inputGroup: {
    marginBottom: 20,
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
  inputText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.light.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: Colors.light.gradientPurple,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  genderButtonTextSelected: {
    color: 'white',
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  viewMapButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewMapText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '500',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  phoneCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    gap: 8,
  },
  phoneCodeText: {
    fontSize: 20,
  },
  phoneInputContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
});