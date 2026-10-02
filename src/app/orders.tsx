import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Empty, H, Muted, Screen } from '@/lib/ui';
import { useStore } from '@/lib/store';
import { inr } from '@/lib/format';
import { C } from '@/lib/theme';

const STEPS = ['Placed', 'Packed', 'On the way', 'Delivered'];

export default function Orders() {
  const router = useRouter();
  const orders = useStore(s => s.orders);
  const [, force] = useState(0);
  useEffect(() => { const id = setInterval(() => force(n => n + 1), 4000); return () => clearInterval(id); }, []);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <H>Orders</H>
        <Pressable onPress={() => router.back()}><Text style={{ color: C.uv1, fontWeight: '600' }}>Close</Text></Pressable>
      </View>
      {orders.length === 0 ? <Empty>No orders yet. Add something from the shop.</Empty> : orders.map(o => {
        // Demo: advances one step every 12 seconds. Replace with real order status from the backend.
        const idx = Math.min(3, Math.floor((Date.now() - o.ts) / 12000));
        return (
          <Card key={o.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '600' }}>Order {o.id}</Text>
              <Text style={{ fontWeight: '700' }}>{inr(o.total)}</Text>
            </View>
            <Muted small>{o.summary}</Muted>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 12 }}>
              {STEPS.map((st, i) => (
                <View key={st} style={{ flex: 1 }}>
                  <View style={{ height: 4, borderRadius: 2, backgroundColor: i <= idx ? C.uv1 : C.line, marginBottom: 5 }} />
                  <Text style={{ fontSize: 11, textAlign: 'center', color: i <= idx ? C.ink : C.muted }}>{st}</Text>
                </View>
              ))}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
