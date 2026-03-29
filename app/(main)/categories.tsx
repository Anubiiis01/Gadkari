import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

/* 🎨 THEME COLORS */
const COLORS = {
  primary: '#F77F00',
  primaryLight: '#FFEDD5',
  bg: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  text: '#111827',
  textMuted: '#6B7280',
  easy: '#10B981',
  moderate: '#F59E0B',
  hard: '#EF4444',
};

/* 📍 SAMPLE DATA */
const PLACES = [
  {
    id: "1",
    title: "Raigad Fort",
    location: "Maharashtra",
    coordinates: { latitude: 18.234, longitude: 73.440 },
    category: "Fort",
    difficulty: "Moderate",
    rating: 4.5,
    distance: "12 km",
    tags: ["Fort", "Historical"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
  },
  {
    id: "2",
    title: "Kalavantin Durg",
    location: "Panvel",
    coordinates: { latitude: 18.982, longitude: 73.240 },
    category: "Trek",
    difficulty: "Hard",
    rating: 4.8,
    distance: "8 km",
    tags: ["Trek", "Adventure"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
  },
  {
    id: "3",
    title: "Pawna Lake",
    location: "Lonavala",
    coordinates: { latitude: 18.651, longitude: 73.469 },
    category: "Lake",
    difficulty: "Easy",
    rating: 4.3,
    distance: "15 km",
    tags: ["Lake", "Camping"],
    image: "https://images.unsplash.com/photo-1433838555443-8c5b126df3c9?w=400",
  },
];

/* 🎯 FILTER OPTIONS - Grouped */
const FILTER_GROUPS = {
  type: ["Fort", "Trek", "Waterfall", "Lake", "Beach"],
  difficulty: ["Easy", "Moderate", "Hard"],
};

export default function CategoriesScreen() {
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showCards, setShowCards] = useState(true);
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  /* 🔍 FILTER LOGIC - Memoized for performance */
  const filteredPlaces = useMemo(() => {
    return PLACES.filter((place) => {
      const matchesSearch = place.title.toLowerCase().includes(search.toLowerCase()) ||
                           place.location.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = selectedFilters.length === 0 ||
        selectedFilters.some((f) =>
          place.category === f ||
          place.difficulty === f ||
          place.tags.includes(f)
        );

      return matchesSearch && matchesFilter;
    });
  }, [search, selectedFilters]);

  /* 🎯 HANDLE FILTER */
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  /* 📍 FOCUS MAP ON CARD */
  const focusMap = (coords: { latitude: number; longitude: number }) => {
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  /* 🎯 GET MARKER COLOR BY DIFFICULTY */
  const getMarkerColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return COLORS.easy;
      case 'Moderate': return COLORS.moderate;
      case 'Hard': return COLORS.hard;
      default: return COLORS.primary;
    }
  };

  /* 🎯 GET DIFFICULTY BADGE STYLE */
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return { bg: COLORS.easy, text: '#fff' };
      case 'Moderate': return { bg: COLORS.moderate, text: '#fff' };
      case 'Hard': return { bg: COLORS.hard, text: '#fff' };
      default: return { bg: COLORS.surface, text: COLORS.text };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🗺️ MAP */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: 18.5204,
          longitude: 73.8567,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        showsMyLocationButton={false}
        showsCompass={false}
      >
{filteredPlaces.map((place) => {
  const markerColor = getMarkerColor(place.difficulty);
  return (
    <Marker
      key={place.id}
      coordinate={place.coordinates}
      onPress={() => focusMap(place.coordinates)}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 1 }} // Ensures the tip of the pin points to the exact coordinate
    >
      <View style={styles.pinWrapper}>
        <View style={[styles.pinShape, { backgroundColor: markerColor }]}>
          <View style={styles.pinInnerCircle} />
        </View>
        <View style={[styles.pinTip, { borderTopColor: markerColor }]} />
      </View>
    </Marker>
  );
})}
      </MapView>

      {/* 🔝 TOP BAR - Search + Actions */}
      <View style={styles.topBar}>
        {/* Back Button */}
        <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search treks, forts..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>


        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowCards(!showCards)}
          >
            <Ionicons 
              name={showCards ? "list" : "grid"} 
              size={20} 
              color={showCards ? COLORS.primary : COLORS.textMuted} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🎯 FILTER BAR */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {Object.entries(FILTER_GROUPS).map(([group, filters]) => (
            <View key={group} style={styles.filterGroup}>
              {filters.map((filter) => {
                const active = selectedFilters.includes(filter);
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => toggleFilter(filter)}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
        
        {/* Clear Filters */}
        {selectedFilters.length > 0 && (
          <TouchableOpacity style={styles.clearFilters} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 📦 BOTTOM CARDS - Toggleable */}
      {showCards && (
        <View style={styles.cardsContainer}>
          {filteredPlaces.length === 0 ? (
            /* Empty State */
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
                <Text style={styles.emptyButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Cards List */
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardScrollContent}
              snapToInterval={width * 0.78}
              decelerationRate="fast"
            >
              {filteredPlaces.map((place) => {
                const diffStyle = getDifficultyStyle(place.difficulty);
                return (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.card}
                    onPress={() => focusMap(place.coordinates)}
                    activeOpacity={0.9}
                  >
                    {/* Image with Loading State */}
                    <View style={styles.cardImageContainer}>
                      {imageLoading[place.id] && (
                        <View style={styles.imageLoader}>
                          <ActivityIndicator size="small" color={COLORS.primary} />
                        </View>
                      )}
                      <Image
                        source={{ uri: place.image }}
                        style={styles.cardImage}
                        onLoadStart={() => setImageLoading(prev => ({ ...prev, [place.id]: true }))}
                        onLoadEnd={() => setImageLoading(prev => ({ ...prev, [place.id]: false }))}
                      />
                      {/* Difficulty Badge */}
                      <View style={[styles.difficultyBadge, { backgroundColor: diffStyle.bg }]}>
                        <Text style={[styles.difficultyText, { color: diffStyle.text }]}>
                          {place.difficulty}
                        </Text>
                      </View>
                      {/* Distance Badge */}
                      <View style={styles.distanceBadge}>
                        <Ionicons name="location-outline" size={12} color="#fff" />
                        <Text style={styles.distanceText}>{place.distance}</Text>
                      </View>
                    </View>

                    {/* Card Content */}
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{place.title}</Text>
                        <View style={styles.ratingBox}>
                          <Ionicons name="star" size={12} color={COLORS.primary} />
                          <Text style={styles.ratingText}>{place.rating}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.cardMeta}>
                        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.cardLocation} numberOfLines={1}>{place.location}</Text>
                      </View>

                      {/* Tags */}
                      <View style={styles.tagContainer}>
                        {place.tags.slice(0, 2).map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* CTA Button */}
                    <TouchableOpacity style={styles.cardCTA}>
                      <Text style={styles.cardCTAText}>View Details</Text>
                      <Ionicons name="chevron-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          
          {/* Results Counter */}
          <View style={styles.resultsCounter}>
            <Text style={styles.resultsText}>
              {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
            </Text>
          </View>
        </View>
      )}

      {/* Spacer for Bottom Navigation */}
      <View style={styles.bottomSpacer} />
    </SafeAreaView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* TOP BAR */
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20, // Increased for the pill curve
    paddingVertical: 10,   // Adjusted for a balanced look
    
    // The "Pill" Secret: Set this high (e.g., 50 or 100)
    borderRadius: 50, 
    
    gap: 10,
    
    // Shadow/Elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4, // Slightly higher for better separation on Android
    
    // Optional: Add a very subtle border for light mode clarity
    borderWidth: 1,
    borderColor: '#F0F0F0', 
  },
  
  searchInput: {
    flex: 1,
    fontSize: 15, // Slightly larger for better readability
    color: COLORS.text,
    paddingVertical: 0, // Prevents Android-specific extra padding
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  /* FILTER BAR */
  filterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 80,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop : 25,
    zIndex: 9,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterGroup: {
    flexDirection: 'row',
    marginRight: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: '#fff',
  },
  clearFilters: {
    position: 'absolute',
    right: 16,
    top: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },

  /* CARDS CONTAINER */
  cardsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    paddingBottom: 20,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cardScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  card: {
    width: width * 0.78,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardImageContainer: {
    position: 'relative',
    height: 130,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    zIndex: 1,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  distanceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  cardContent: {
    padding: 14,
    paddingBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  cardLocation: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  cardCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
  cardCTAText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  resultsCounter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  /* MARKER */
/* 📍 UPDATED AESTHETIC MARKER STYLES */
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Subtle glass border
    
    // Modern Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    gap: 6,
  },
  markerSeparator: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'], // Keeps numbers aligned
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    // borderTopColor is handled dynamically in JSX
    alignSelf: 'center',
    marginTop: -1, 
    // Shadow for the pointer to match the box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },


  /* 📍 NEW GOOGLE-STYLE PIN MARKER */
  pinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinShape: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderBottomRightRadius: 2, // Creates the slight point before the tip
    transform: [{ rotate: '-45deg' }], // Rotates the circle into a teardrop
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  pinInnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    // We rotate it back 45deg so it stays a perfect circle inside the rotated pin
    transform: [{ rotate: '45deg' }], 
  },
  pinTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -6, // Pulls tip up to connect with the pinShape
    zIndex: -1,
  },

  /* SPACER */
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 100 : 80,
  },
});