import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../src/constants/theme';

export default function SearchScreen() {
  const [origin, setOrigin] = useState('Hồ Chí Minh');
  const [destination, setDestination] = useState('Đà Lạt');
  const [departureDate, setDepartureDate] = useState('28/10/2025');
  const [selectedTransport, setSelectedTransport] = useState('');

  const transportOptions = [
    { id: 'bus', name: 'Xe buýt', icon: 'bus' },
    { id: 'car', name: 'Ô tô', icon: 'car' },
    { id: 'motorbike', name: 'Xe máy', icon: 'bicycle' },
    { id: 'airplane', name: 'Máy bay', icon: 'airplane' },
    { id: 'train', name: 'Tàu hỏa', icon: 'train' },
  ];

  const handleSearch = () => {
    console.log('Searching for:', { origin, destination, departureDate, selectedTransport });
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm chuyến đi</Text>
        <Text style={styles.headerSubtitle}>Khám phá hành trình của bạn</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Card */}
        <View style={styles.searchCard}>
          {/* Origin */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Điểm đi</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Nhập điểm đi"
                placeholderTextColor={Colors.light.gray}
              />
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
            <Ionicons name="swap-vertical" size={20} color="white" />
          </TouchableOpacity>

          {/* Destination */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Điểm đến</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={destination}
                onChangeText={setDestination}
                placeholder="Nhập điểm đến"
                placeholderTextColor={Colors.light.gray}
              />
            </View>
          </View>

          {/* Departure Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ngày khởi hành</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={departureDate}
                onChangeText={setDepartureDate}
                placeholder="Chọn ngày"
                placeholderTextColor={Colors.light.gray}
              />
              <TouchableOpacity style={styles.calendarButton}>
                <Ionicons name="calendar-outline" size={20} color={Colors.light.gray} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Transport Options */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phương tiện</Text>
            <View style={styles.transportGrid}>
              {transportOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.transportButton,
                    selectedTransport === option.id && styles.transportButtonSelected,
                  ]}
                  onPress={() => setSelectedTransport(option.id)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={selectedTransport === option.id ? Colors.light.primary : Colors.light.gray}
                  />
                  <Text
                    style={[
                      styles.transportText,
                      selectedTransport === option.id && styles.transportTextSelected,
                    ]}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="white" />
            <Text style={styles.searchButtonText}>Tìm kiếm</Text>
          </TouchableOpacity>
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
    backgroundColor: Colors.light.headerBackground,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  searchCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  calendarButton: {
    padding: 4,
  },
  swapButton: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  transportButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
    marginBottom: 10,
  },
  transportButtonSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.secondary,
  },
  transportText: {
    fontSize: 12,
    color: Colors.light.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  transportTextSelected: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
