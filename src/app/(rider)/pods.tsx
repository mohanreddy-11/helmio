import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Banner, Btn, Card, Chip, Empty, H, Muted, Screen, Seg, StatusPill } from '@/lib/ui';
import { useStore } from '@/lib/store';
import { useUserLocation } from '@/lib/location';
import LiveMap from '@/lib/LiveMap';
import { distLabel } from '@/lib/format';
import { C } from '@/lib/theme';

const MAP_H = 300;

export default function Pods() {
  const router = useRouter();
  const pods = useStore(s => s.pods);
  const userLoc = useStore(s => s.userLoc);
  const { status, request } = useUserLocation();
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [q, setQ] = useState('');
  const [fAvail, setFAvail] = useState(false);
  const [fNear, setFNear] = useState(false);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return pods
      .filter(p => (!query || `${p.name} ${p.area}`.toLowerCase().includes(query))
        && (!fAvail || p.status === 'available') && (!fNear || p.dist <= 500))
      .sort((a, b) => a.dist - b.dist);
  }, [pods, q, fAvail, fNear]);

  const open = (id: number) => router.push({ pathname: '/pod/[id]', params: { id: String(id) } });
  const located = status === 'granted' && userLoc !== null;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <H>Find a pod</H>
        <View style={{ width: 130, marginBottom: 14 }}>
          <Seg options={[{ k: 'map', l: 'Map' }, { k: 'list', l: 'List' }]} value={mode} onChange={setMode} />
        </View>
      </View>

      {(status === 'undetermined' || status === 'denied') && (
        <Card style={{ marginBottom: 14 }}>
          <Text style={{ fontWeight: '600', fontSize: 16, color: C.ink }}>
            {status === 'denied' ? 'Location is off' : 'See pods near you'}
          </Text>
          <View style={{ height: 4 }} />
          <Muted small>
            {status === 'denied'
              ? "Allow location for Helmio in your phone or browser settings, then try again. We only use it to show nearby pods."
              : 'Helmio uses your location to show where you are and which pods are closest. It is only used while the app is open.'}
          </Muted>
          <View style={{ height: 12 }} />
          <Btn label={status === 'denied' ? 'Try again' : 'Allow location'} onPress={request} />
        </Card>
      )}

      <View style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, marginBottom: 10 }}>
        <TextInput value={q} onChangeText={setQ} placeholder="Search by place" placeholderTextColor={C.muted}
          style={{ paddingVertical: 12, fontSize: 15, color: C.ink }} accessibilityLabel="Search pods" />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        <Chip label="Available now" on={fAvail} onPress={() => setFAvail(v => !v)} />
        <Chip label="Under 500 m" on={fNear} onPress={() => setFNear(v => !v)} />
      </View>

      {mode === 'map' && (
        located ? (
          <View style={{ marginBottom: 12 }}>
            <LiveMap user={userLoc} pods={list} onPodPress={open} height={MAP_H} />
          </View>
        ) : status === 'granted' ? (
          <View style={{ height: 120, borderRadius: 20, backgroundColor: C.offBg, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Muted>Finding your location…</Muted>
          </View>
        ) : null
      )}

      {list.length === 0 ? (
        <Empty>No pods match these filters.</Empty>
      ) : (
        <View style={{ gap: 10 }}>
          {list.map(p => (
            <Pressable key={p.id} onPress={() => open(p.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: C.ink }} numberOfLines={1}>{p.name}</Text>
                <Text style={{ color: C.muted, fontSize: 13 }}>
                  {p.area}{located ? ` · ${distLabel(p.dist)} away` : ''}
                </Text>
              </View>
              <StatusPill pod={p} />
            </Pressable>
          ))}
        </View>
      )}
      <Banner />
    </Screen>
  );
}
