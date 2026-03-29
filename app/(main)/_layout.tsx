import BottomNav from '../../src/components/BottomNav';
import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function MainLayout() {
  return (
    <View style={styles.container}>
      {/* 👇 Auto-discovers home.tsx, categories.tsx, etc. - NO manual Screen declarations needed */}
      <Stack screenOptions={{ headerShown: false }} />
      
      {/* 👇 BottomNav appears on all (main) group screens */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});