import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Banner, Btn, Card, H, Muted, Screen, Seg } from '@/lib/ui';
import { LISTINGS, PRODUCTS, UNLOCK_FEE, useStore } from '@/lib/store';
import { inr } from '@/lib/format';
import { C } from '@/lib/theme';

export default function Shop() {
  const router = useRouter();
  const { cart, addCart, removeCart, unlocked, unlock } = useStore();
  const [seg, setSeg] = useState<'acc' | 'res'>('acc');
  const count = Object.values(cart).reduce((a, n) => a + n, 0);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <H>Shop</H>
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 14 }}>
          <Pressable onPress={() => router.push('/orders')} accessibilityLabel="Orders"><Ionicons name="cube-outline" size={24} color={C.ink} /></Pressable>
          <Pressable onPress={() => router.push('/cart')} accessibilityLabel="Cart">
            <Ionicons name="cart-outline" size={24} color={C.ink} />
            {count > 0 && <View style={{ position: 'absolute', top: -6, right: -8, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.uv1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{count}</Text></View>}
          </Pressable>
        </View>
      </View>

      <Seg options={[{ k: 'acc', l: 'Accessories' }, { k: 'res', l: 'Resale parts' }]} value={seg} onChange={setSeg} />
      <View style={{ height: 12 }} />

      {seg === 'acc' ? (
        <>
          <Muted small>Helmio delivers to you. No need to contact a seller.</Muted>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
            {PRODUCTS.map(p => {
              const n = cart[p.id] ?? 0;
              return (
                <View key={p.id} style={{ width: '48.5%', backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 10, gap: 8 }}>
                  <View style={{ height: 84, borderRadius: 13, backgroundColor: C.busyBg, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={p.icon as keyof typeof Ionicons.glyphMap} size={34} color={C.busy} />
                  </View>
                  <Text style={{ fontWeight: '600', color: C.ink, minHeight: 36 }}>{p.name}</Text>
                  <Text style={{ fontWeight: '700' }}>{inr(p.price)}</Text>
                  {n ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.bg, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 6 }}>
                      <Pressable onPress={() => removeCart(p.id)} accessibilityLabel="Remove one"><Text style={{ fontSize: 20 }}>−</Text></Pressable>
                      <Text style={{ fontWeight: '600' }}>{n}</Text>
                      <Pressable onPress={() => addCart(p.id)} accessibilityLabel="Add one"><Text style={{ fontSize: 20 }}>+</Text></Pressable>
                    </View>
                  ) : <Btn small kind="dark" label="Add to cart" onPress={() => addCart(p.id)} />}
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <Muted small>Resold by riders. Unlock a seller's contact to arrange the part directly.</Muted>
          <View style={{ gap: 10, marginTop: 10 }}>
            {LISTINGS.map(l => (
              <Card key={l.id} style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: C.ink }}>{l.name}</Text>
                    <Muted small>{l.cond} · {inr(l.price)}</Muted>
                  </View>
                  <Text style={{ alignSelf: 'flex-start', backgroundColor: C.offBg, color: C.off, fontSize: 12, fontWeight: '600', paddingHorizontal: 9, paddingVertical: 2, borderRadius: 99, overflow: 'hidden' }}>Sold</Text>
                </View>
                {unlocked[l.id]
                  ? <Text style={{ backgroundColor: C.okBg, color: C.ok, fontWeight: '600', padding: 10, borderRadius: 12, overflow: 'hidden' }}>{l.seller} · {l.phone}</Text>
                  : <Btn small kind="ghost" label={`Unlock seller contact · ${inr(UNLOCK_FEE)}`} onPress={() => unlock(l.id)} />}
              </Card>
            ))}
          </View>
        </>
      )}
      <Banner />
    </Screen>
  );
}
