import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: 'home', route: '/(main)/home' },
    { name: 'Categories', icon: 'grid', route: '/(main)/categories' },
    { name: 'Add', icon: 'add', route: '/(main)/add', isCenter: true },
    { name: 'Bookings', icon: 'calendar', route: '/(main)/bookings' },
    { name: 'Menu', icon: 'menu', route: '/(main)/menu' },
  ];

  const isActive = (route: string) => pathname === route;

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);

        if (tab.isCenter) {
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.centerButton}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.8}
            >
              <View style={styles.centerButtonInner}>
                <Ionicons name={tab.icon as any} size={32} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => router.push(tab.route)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={`${tab.icon}-outline` as any}
              size={24}
              color={active ? '#F77F00' : '#6B7280'}
            />
            <Text style={[styles.tabText, { color: active ? '#F77F00' : '#6B7280' }]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    height: Platform.OS === 'ios' ? 90 : 75,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -22,
  },
  centerButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F77F00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F77F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});