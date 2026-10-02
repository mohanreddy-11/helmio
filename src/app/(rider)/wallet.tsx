import React, { useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { Banner, Btn, Card, H, Screen, Section } from '@/lib/ui';
import { AD_REWARD, useStore } from '@/lib/store';
import { ago, inr } from '@/lib/format';
import { C } from '@/lib/theme';

function AdModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const rewardAd = useStore(s => s.rewardAd);
  const [left, setLeft] = useState(5);
  useEffect(() => {
    if (!visible) return;
    setLeft(5);
    const id = setInterval(() => setLeft(n => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [visible]);
  const done = left === 0;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(10,12,14,.55)', justifyContent: 'center', padding: 18 }}>
        <View style={{ backgroundColor: C.surface, borderRadius: 24, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Sponsored video</Text>
          <View style={{ height: 140, borderRadius: 16, backgroundColor: '#1B1640', alignItems: 'center', justifyContent: 'center', marginVertical: 14 }}>
            {/* TODO: plug in a real rewarded-ad SDK here */}
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>RideSure</Text>
            <Text style={{ color: '#ffffffcc', marginTop: 4 }}>Two-wheeler insurance in 2 minutes</Text>
          </View>
          <View style={{ height: 5, borderRadius: 3, backgroundColor: C.line, marginBottom: 14, overflow: 'hidden' }}>
            <View style={{ height: 5, width: `${((5 - left) / 5) * 100}%`, backgroundColor: C.uv1 }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Btn style={{ flex: 1 }} kind="ghost" label={done ? 'Close' : 'Skip, no reward'} onPress={onClose} />
            <Btn style={{ flex: 1 }} label={`Collect ${inr(AD_REWARD)}`} disabled={!done} onPress={() => { rewardAd(); onClose(); }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function Wallet() {
  const { wallet, txns, topup } = useStore();
  const [ad, setAd] = useState(false);
  return (
    <Screen>
      <H>Wallet</H>
      <View style={{ backgroundColor: C.uv1, borderRadius: 24, padding: 20 }}>
        <Text style={{ color: '#ffffffd9' }}>Balance</Text>
        <Text style={{ color: '#fff', fontSize: 38, fontWeight: '700', marginVertical: 4 }}>{inr(wallet)}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <Btn style={{ flex: 1, backgroundColor: '#ffffff30', borderColor: 'transparent' }} label={`Watch ad · +${inr(AD_REWARD)}`} onPress={() => setAd(true)} />
          <Btn style={{ flex: 1, backgroundColor: '#ffffff30', borderColor: 'transparent' }} label="Add ₹100" onPress={topup} />
        </View>
      </View>
      <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Top-up is a demo button. A real payment gateway plugs in here.</Text>
      <Section>Activity</Section>
      <Card>
        {txns.map(t => (
          <View key={t.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.ink }}>{t.t}</Text>
              <Text style={{ color: C.muted, fontSize: 12 }}>{ago(t.ts)}</Text>
            </View>
            <Text style={{ fontWeight: '600', color: t.amt > 0 ? C.ok : C.ink }}>{t.amt > 0 ? '+' : ''}{inr(t.amt)}</Text>
          </View>
        ))}
      </Card>
      <Banner />
      <AdModal visible={ad} onClose={() => setAd(false)} />
    </Screen>
  );
}
