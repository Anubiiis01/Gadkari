import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native'; 
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

// Dynamic search placeholders that rotate
const SEARCH_PLACEHOLDERS = [
  "Search for treks...",
  "Search for rivers...",
  "Search for campsites...",
  "Search for waterfalls...",
  "Search for adventure spots...",
  "Search for hiking trails...",
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<string>('Loading location...');
  const [locationLoading, setLocationLoading] = useState(true);
  const [searchPlaceholderIndex, setSearchPlaceholderIndex] = useState(0);

  // 🔁 Dynamic Search Placeholder Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // 📍 Auto-Fetch Location on Mount
  useEffect(() => {
    (async () => {
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocation('Panvel, Maharashtra'); // Fallback
          setLocationLoading(false);
          return;
        }

        // Get current position
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Reverse geocode to get address name
        const address = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (address.length > 0) {
          const { city, region, country } = address[0];
          setLocation(`${city || 'Unknown'}, ${region || country}`);
        } else {
          setLocation('Current Location');
        }
      } catch (error) {
        console.error('Location error:', error);
        setLocation('Panvel, Maharashtra'); // Fallback
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  const handleLocationPress = async () => {
    // Manual refresh location
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        if (address.length > 0) {
          const { city, region } = address[0];
          setLocation(`${city || 'Unknown'}, ${region || ''}`);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not fetch location. Please check permissions.');
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
		 <StatusBar 
    barStyle="dark-content" 
    backgroundColor="#FFFFFF" 
    translucent={false} 
  />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* 🔝 HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hey Akshay 👋</Text>
            
            {/* Location Selector */}
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleLocationPress}
              disabled={locationLoading}
              activeOpacity={0.7}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color="#F77F00" />
              ) : (
                <Ionicons name="location-sharp" size={14} color="#F77F00" />
              )}
              <Text 
                style={[styles.locationText, locationLoading && { color: '#9CA3AF' }]}
                numberOfLines={1}
              >
                {location}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.profileCircle} activeOpacity={0.8}>
            <Ionicons name="person" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 🔍 DYNAMIC SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder={SEARCH_PLACEHOLDERS[searchPlaceholderIndex]}
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* ⚡ QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickActions}>
          {actions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.actionCard} activeOpacity={0.8}>
              <View style={styles.actionIconBox}>
                <Ionicons 
                  name={item.icon as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color="#F77F00" 
                />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🗓️ UPCOMING TREKS (Preview Section) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Treks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trekCard}>
          <View style={styles.trekImagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#D1D5DB" />
          </View>
          <View style={styles.trekInfo}>
            <Text style={styles.trekName}>Prabalgad Fort Trek</Text>
            <View style={styles.trekMeta}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.trekMetaText}>2 Days • Moderate</Text>
            </View>
            <View style={styles.trekMeta}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.trekMetaText}>Panvel, Maharashtra</Text>
            </View>
            <Text style={styles.trekPrice}>₹1,499 <Text style={styles.trekPriceSub}>/ person</Text></Text>
          </View>
        </View>

        {/* Spacer for bottom navigation */}
        <View style={styles.bottomSpacer} />

      </ScrollView>
    </SafeAreaView>
  );
}

const actions = [
  { icon: "walk", label: "Treks" },
  { icon: "bonfire", label: "Camping" },
  { icon: "water", label: "Waterfalls" },
  { icon: "bag", label: "Rentals" },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 4,
    maxWidth: 180,
  },
  profileCircle: {
    backgroundColor: '#F77F00',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F77F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  /* SEARCH */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },

  /* SECTIONS */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#F77F00',
    fontWeight: '600',
  },

  /* QUICK ACTIONS */
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#F9FAFB',
    width: '22%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconBox: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },

  /* TREK CARD */
  trekCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  trekImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trekInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  trekName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  trekMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  trekMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  trekPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F77F00',
    marginTop: 4,
  },
  trekPriceSub: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },

  /* SPACER */
  bottomSpacer: {
    height: 80,
  },
});