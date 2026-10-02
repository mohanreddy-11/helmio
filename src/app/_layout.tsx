import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toast } from '@/lib/ui';
import { useStore } from '@/lib/store';

export default function RootLayout() {
  // Drives every live pod countdown and the owner's "cycle finished" alerts.
  useEffect(() => {
    const id = setInterval(() => useStore.getState().tick(), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="pod/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="cart" options={{ presentation: 'modal' }} />
        <Stack.Screen name="orders" options={{ presentation: 'modal' }} />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}
