import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function AddScreen() { // ✅ MUST be "export default"
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Create New</Text>
      </View>
      <Text style={styles.subtitle}>What would you like to add?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
  backButton: { padding: 8, marginRight: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 15, color: '#6B7280', marginBottom: 24 },
});