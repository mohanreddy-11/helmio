import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/lib/theme';
import { useStore } from '@/lib/store';

const icon = (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function OwnerTabs() {
  const role = useStore(s => s.role);
  const unread = useStore(s => s.unread);
  const pending = useStore(s => s.reqs.filter(r => s.pods.find(p => p.id === r.podId)?.mine).length);
  if (role !== 'owner') return <Redirect href="/" />;
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.ink, tabBarInactiveTintColor: C.muted }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: icon('notifications-outline'), tabBarBadge: unread > 0 ? unread : undefined }} />
      <Tabs.Screen name="ads" options={{ title: 'Ads', tabBarIcon: icon('megaphone-outline'), tabBarBadge: pending > 0 ? pending : undefined }} />
      <Tabs.Screen name="settings" options={{ title: 'Profile', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  );
}
