import React from 'react';
import { Text, View } from 'react-native';
import { Card, H, Muted, Screen, Section, StatusPill } from '@/lib/ui';
import { useStore } from '@/lib/store';
import { inr } from '@/lib/format';
import { C } from '@/lib/theme';

export default function OwnerHome() {
  const { pods, campaigns } = useStore();
  const mine = pods.filter(p => p.mine);
  const adOf = (id: number) => campaigns.filter(c => c.podId === id).reduce((a, c) => a + c.rate, 0);
  const usage = mine.reduce((a, p) => a + p.usage, 0);
  const ads = mine.reduce((a, p) => a + adOf(p.id), 0);

  return (
    <Screen>
      <H>Today</H>
      <View style={{ backgroundColor: C.uv1, borderRadius: 24, padding: 20 }}>
        <Text style={{ color: '#ffffffd9' }}>Total earned today</Text>
        <Text style={{ color: '#fff', fontSize: 38, fontWeight: '700', marginVertical: 4 }}>{inr(usage + ads)}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          {[['Usage', usage], ['Ads', ads]].map(([l, v]) => (
            <View key={l as string} style={{ flex: 1, backgroundColor: '#ffffff29', borderRadius: 14, padding: 10 }}>
              <Text style={{ color: '#ffffffd9', fontSize: 13 }}>{l}</Text>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{inr(v as number)}</Text>
            </View>
          ))}
        </View>
      </View>
      <Section>Your pods</Section>
      <View style={{ gap: 10 }}>
        {mine.map(p => (
          <Card key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: C.ink }}>{p.name}</Text>
              <Muted small>{p.cycles} cycles · {inr(p.usage)} usage · {inr(adOf(p.id))} ads</Muted>
            </View>
            <StatusPill pod={p} />
          </Card>
        ))}
      </View>
    </Screen>
  );
}
