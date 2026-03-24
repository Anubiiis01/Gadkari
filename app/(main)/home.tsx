import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import * as Location from 'expo-location';
import React, { useEffect, useState, memo } from 'react';
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
  Image,
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

// ✅ CardImage component moved OUTSIDE main component + memoized for performance
interface CardImageProps {
  imageUrl: string;
}

const CardImage = memo(function CardImage({ imageUrl }: CardImageProps) {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(false);

  return (
    <>
      {loading && (
        <View style={styles.imageLoader}>
          <ActivityIndicator size="small" color="#F77F00" />
        </View>
      )}
      
      <Image
        source={{ uri: imageUrl }}
        style={styles.horizontalImage}
        resizeMode="cover"
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      
      {error && (
        <View style={styles.imageError}>
          <Ionicons name="image-outline" size={40} color="#D1D5DB" />
        </View>
      )}
    </>
  );
});

// ✅ Actions array defined before component
const actions: Array<{ icon: keyof typeof Ionicons.glyphMap; label: string }> = [
  { icon: "walk", label: "Treks" },
  { icon: "bonfire", label: "Camping" },
  { icon: "water", label: "Waterfalls" },
  { icon: "bag", label: "Rentals" },
];

// ✅ All image URLs fixed + fallbacks added
const sections: Array<{
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  data: Array<{
    name: string;
    location: string;
    price: string;
    rating: number;
    duration: string;
    difficulty: string;
    image: string;
  }>;
}> = [
  {
    title: "Upcoming Treks",
    icon: "walk",
    data: [
      { 
        name: "Prabalgad Trek", 
        location: "Panvel", 
        price: "₹1,499", 
        rating: 4.5, 
        duration: "2D", 
        difficulty: "Moderate",
        image: "https://www.tripplatform.com/blog/wp-content/uploads/2016/06/Prabalgad-Fort.jpg"
      },
      { 
        name: "Rajmachi Trek", 
        location: "Lonavala", 
        price: "₹1,299", 
        rating: 4.7, 
        duration: "1D", 
        difficulty: "Easy",
        image: "https://explorersgroup.in/wp-content/uploads/2018/08/Rajmachi.png"
      },
      { 
        name: "Lohagad Fort", 
        location: "Pune", 
        price: "₹999", 
        rating: 4.3, 
        duration: "1D", 
        difficulty: "Easy",
        image: "https://t3.ftcdn.net/jpg/03/57/38/26/360_F_357382636_ffqv9rKk7lMldcRFpxBlDnagWqMuHEGm.jpg" // ✅ Fixed: was "flag"
      },
    ],
  },
  {
    title: "Seasonal Favorites",
    icon: "leaf",
    data: [
      { 
        name: "Kalsubai Peak", 
        location: "Igatpuri", 
        price: "₹1,799", 
        rating: 4.8, 
        duration: "2D", 
        difficulty: "Easy",
        image: "https://static.justwravel.com/images/cgnfe1hd/production/f5ede87c094269de2738a33b5eef864109430a58-1200x675.jpg?fm=webp" // ✅ Fixed: was "arrow-up"
      },
      { 
        name: "Harishchandragad", 
        location: "Ahmednagar", 
        price: "₹1,599", 
        rating: 4.6, 
        duration: "2D", 
        difficulty: "Moderate",
        image: "https://www.bhatkantimaharashtrachi.com/system/images/000/680/669/2a724abfd2512844847d12b50e9d21b7/banner/harishchandragad_trek.jpg" // ✅ Fixed: was "cloud"
      },
    ],
  },
  {
    title: "Top Waterfalls",
    icon: "water",
    data: [
      { 
        name: "Devkund Waterfall", 
        location: "Raigad", 
        price: "₹999", 
        rating: 4.4, 
        duration: "1D", 
        difficulty: "Moderate",
        image: "https://www.thomascook.in/blog/wp-content/uploads/2023/09/Devkund.jpg" // ✅ Fixed: was "water"
      },
      { 
        name: "Bhivpuri Falls", 
        location: "Karjat", 
        price: "₹799", 
        rating: 4.2, 
        duration: "1D", 
        difficulty: "Easy",
        image: "https://thumbs.dreamstime.com/b/landscape-view-bhivpuri-waterfalls-ashane-india-vertical-shot-257375905.jpg" // ✅ Fixed: was "boat"
      },
    ],
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Loading location...');
  const [locationLoading, setLocationLoading] = useState(true);
  const [searchPlaceholderIndex, setSearchPlaceholderIndex] = useState(0);
  // ✅ Removed unused global imageLoading/imageError states (CardImage handles its own)

  // 🔁 Dynamic Search Placeholder Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 📍 Auto-Fetch Location on Mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocation('Panvel, Maharashtra');
          setLocationLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

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
        setLocation('Panvel, Maharashtra');
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  const handleLocationPress = async () => {
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
                  name={item.icon} 
                  size={24} 
                  color="#F77F00" 
                />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🗂️ SECTIONS WITH HORIZONTAL CARDS */}
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.sectionContainer}>
            
            {/* Section Header with Icon */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons 
                  name={section.icon} 
                  size={20} 
                  color="#F77F00" 
                />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <TouchableOpacity 
                style={styles.seeAllButton}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#F77F00" />
              </TouchableOpacity>
            </View>

            {/* Horizontal Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              decelerationRate="fast"
              snapToInterval={200}
              snapToAlignment="start"
            >
              {section.data.map((item, cardIndex) => (
                <TouchableOpacity 
                  key={cardIndex} 
                  style={styles.horizontalCard}
                  activeOpacity={0.9}
                >
                  {/* ✅ Image + Badges wrapped together for proper absolute positioning */}
                  <View style={styles.horizontalImageWrapper}>
                    <CardImage imageUrl={item.image} />
                    
                    {/* Difficulty Badge */}
                    <View style={[
                      styles.difficultyBadge, 
                      item.difficulty === 'Easy' && styles.easyBadge,
                      item.difficulty === 'Moderate' && styles.moderateBadge,
                      item.difficulty === 'Hard' && styles.hardBadge,
                    ]}>
                      <Text style={styles.difficultyText}>{item.difficulty}</Text>
                    </View>

                    {/* Favorite Button */}
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Ionicons name="heart-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {/* Info Section */}
                  <View style={styles.horizontalInfo}>
                    <Text style={styles.trekName} numberOfLines={1}>{item.name}</Text>
                    
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                      <Text style={styles.trekMetaText} numberOfLines={1}>{item.location}</Text>
                    </View>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color="#6B7280" />
                        <Text style={styles.metaText}>{item.duration}</Text>
                      </View>
                      
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#F77F00" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.trekPrice}>{item.price}</Text>
                      <Text style={styles.trekPriceSub}>/ person</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        {/* Spacer for bottom navigation */}
        <View style={styles.bottomSpacer} />

      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingTop: 50,
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
    marginTop: 10,
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
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFBEB',
  },
  seeAllText: {
    fontSize: 13,
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

  /* HORIZONTAL CARDS */
  sectionContainer: {
    marginBottom: 28,
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  horizontalCard: {
    width: 190,
    backgroundColor: '#fff',
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
  horizontalImageWrapper: {
    position: 'relative',
    height: 110,
    width: '100%',
  },
  horizontalImage: {
    height: 110,
    width: '100%',
    backgroundColor: '#F3F4F6',
  },
  horizontalInfo: {
    padding: 12,
  },
  trekName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  trekMetaText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F77F00',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  trekPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F77F00',
  },
  trekPriceSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 2,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#6B7280',
    zIndex: 2,
  },
  easyBadge: { backgroundColor: '#10B981' },
  moderateBadge: { backgroundColor: '#F59E0B' },
  hardBadge: { backgroundColor: '#EF4444' },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    zIndex: 1,
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    zIndex: 1,
  },

  /* SPACER */
  bottomSpacer: {
    height: 80,
  },
});