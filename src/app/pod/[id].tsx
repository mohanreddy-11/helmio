import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Btn, Field, H, Muted, Screen, StatusPill } from '@/lib/ui';
import { CYCLE_PRICE, useStore } from '@/lib/store';
import { distLabel, inr } from '@/lib/format';
import { C } from '@/lib/theme';

export default function PodDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pod = useStore(s => s.pods.find(p => p.id === Number(id)));
  const { wallet, startCycle, sendInquiry, toast } = useStore();
  const [form, setForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');

  if (!pod) return null;
  const hint = pod.status === 'cycle' ? 'Free when the timer ends' : pod.status === 'offline' ? 'Not taking helmets right now' : 'Ready for a helmet';

  const submit = () => {
    if (!name.trim() || phone.length !== 10 || !msg.trim()) return toast('Add a name, a 10-digit phone and a message');
    sendInquiry(pod.id, name.trim(), phone, msg.trim());
    router.back();
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <H style={{ marginBottom: 2 }}>{pod.name}</H>
          <Muted small>{pod.area} · {distLabel(pod.dist)} away</Muted>
        </View>
        <Pressable onPress={() => router.back()}><Text style={{ color: C.uv1, fontWeight: '600' }}>Close</Text></Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 }}>
        <StatusPill pod={pod} /><Muted small>{hint}</Muted>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Btn style={{ flex: 1 }} kind="ghost" label="Directions" onPress={() =>
          // TODO: use real pod latitude/longitude once pods come from the backend
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pod.name)}`)} />
        <Btn style={{ flex: 1 }} label={`Start · ${inr(CYCLE_PRICE)}`} disabled={pod.status !== 'available'}
          onPress={() => { if (startCycle(pod.id)) router.back(); }} />
      </View>
      <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
        Paid from your wallet ({inr(wallet)}). One cycle takes under 4.5 minutes.
      </Text>

      <View style={{ height: 1, backgroundColor: C.line, marginVertical: 18 }} />

      {!form ? (
        <Pressable onPress={() => setForm(true)} style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: C.muted }}>
          <Text style={{ fontWeight: '600', color: C.ink }}>Advertise on this screen</Text>
          <Muted small>Send a request to this pod's owner</Muted>
        </Pressable>
      ) : (
        <View>
          <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 4 }}>Advertise on this screen</Text>
          <Muted small>Your request goes straight to the owner of {pod.name}.</Muted>
          <View style={{ height: 10 }} />
          <Field value={name} onChangeText={setName} placeholder="Your or brand name" />
          <Field prefix="+91" value={phone} onChangeText={t => setPhone(t.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={10} placeholder="Phone number" />
          <Field value={msg} onChangeText={setMsg} placeholder="What would you like to promote?" multiline />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Btn style={{ flex: 1 }} kind="ghost" label="Cancel" onPress={() => setForm(false)} />
            <Btn style={{ flex: 1 }} label="Send request" onPress={submit} />
          </View>
        </View>
      )}
    </Screen>
  );
}
