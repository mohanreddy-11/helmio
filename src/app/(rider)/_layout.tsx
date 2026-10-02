import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/lib/theme';
import { useStore } from '@/lib/store';

const icon = (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function RiderTabs() {
  const role = useStore(s => s.role);
  if (role !== 'rider') return <Redirect href="/" />;
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.ink, tabBarInactiveTintColor: C.muted }}>
      <Tabs.Screen name="pods" options={{ title: 'Pods', tabBarIcon: icon('location-outline') }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop', tabBarIcon: icon('bag-outline') }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet', tabBarIcon: icon('wallet-outline') }} />
      <Tabs.Screen name="account" options={{ title: 'Profile', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  );
}
