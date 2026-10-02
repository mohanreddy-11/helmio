import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Btn, Card, Empty, Field, H, Muted, Screen, Section } from '@/lib/ui';
import { Req, useStore } from '@/lib/store';
import { inr } from '@/lib/format';
import { C } from '@/lib/theme';

function RequestCard({ r }: { r: Req }) {
  const { pods, acceptReq, declineReq, toast } = useStore();
  const [rate, setRate] = useState(String(r.rate));
  const podName = pods.find(p => p.id === r.podId)?.name ?? '';
  return (
    <Card>
      <Text style={{ fontWeight: '600', color: C.ink }}>{r.name} <Text style={{ color: C.muted, fontWeight: '400' }}>for {podName}</Text></Text>
      <Text style={{ marginVertical: 6, color: C.ink }}>{r.msg}</Text>
      <Muted small>{r.phone.startsWith('+') ? r.phone : `+91 ${r.phone}`}</Muted>
      <View style={{ height: 10 }} />
      <Field prefix="₹" suffix="per day" value={rate} onChangeText={t => setRate(t.replace(/\D/g, ''))} keyboardType="number-pad" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Btn style={{ flex: 1 }} kind="ghost" label="Decline" onPress={() => declineReq(r.id)} />
        <Btn style={{ flex: 1 }} label="Accept" onPress={() => {
          const n = parseInt(rate, 10);
          if (!n) return toast('Enter a daily rate');
          acceptReq(r.id, n);
        }} />
      </View>
    </Card>
  );
}

export default function Ads() {
  const { pods, campaigns, reqs } = useStore();
  const mineIds = pods.filter(p => p.mine).map(p => p.id);
  const camps = campaigns.filter(c => mineIds.includes(c.podId));
  const pending = reqs.filter(r => mineIds.includes(r.podId));

  return (
    <Screen>
      <H>Ads</H>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Running</Text>
      {camps.length === 0 ? <Empty>No running campaigns yet.</Empty> : (
        <View style={{ gap: 10 }}>
          {camps.map(c => (
            <Card key={c.id}>
              <Text style={{ fontWeight: '600', color: C.ink }}>{c.adv}</Text>
              <Muted small>{pods.find(p => p.id === c.podId)?.name}</Muted>
              <View style={{ flexDirection: 'row', gap: 24, marginTop: 8 }}>
                <View><Muted small>Daily rate</Muted><Text style={{ fontWeight: '700', fontSize: 16 }}>{inr(c.rate)}</Text></View>
                <View><Muted small>Total earned</Muted><Text style={{ fontWeight: '700', fontSize: 16 }}>{inr(c.total)}</Text></View>
              </View>
            </Card>
          ))}
        </View>
      )}
      <Section>Requests</Section>
      {pending.length === 0
        ? <Empty>No pending requests. Riders and businesses can send one from a pod's screen.</Empty>
        : <View style={{ gap: 10 }}>{pending.map(r => <RequestCard key={r.id} r={r} />)}</View>}
    </Screen>
  );
}
