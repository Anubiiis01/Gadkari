import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function BookingsScreen() { // ✅ MUST be "export default"
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>0 active trips</Text>
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No bookings yet</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  emptyState: { alignItems: 'center', padding: 40, marginTop: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#111827' },
});