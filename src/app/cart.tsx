import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Card, Empty, H, Muted, Screen } from '@/lib/ui';
import { PRODUCTS, cartTotal, useStore } from '@/lib/store';
import { inr } from '@/lib/format';
import { C } from '@/lib/theme';

export default function Cart() {
  const router = useRouter();
  const { cart, wallet, addCart, removeCart, placeOrder } = useStore();
  const items = Object.entries(cart);
  const total = cartTotal(cart);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <H>Cart</H>
        <Pressable onPress={() => router.back()} accessibilityLabel="Close"><Text style={{ color: C.uv1, fontWeight: '600' }}>Close</Text></Pressable>
      </View>
      {items.length === 0 ? <Empty>Your cart is empty.</Empty> : (
        <>
          <Card>
            {items.map(([id, n]) => {
              const p = PRODUCTS.find(x => x.id === id)!;
              return (
                <View key={id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: C.ink }}>{p.name}</Text>
                    <Muted small>{inr(p.price)} each</Muted>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <Pressable onPress={() => removeCart(id)} accessibilityLabel="Remove one"><Text style={{ fontSize: 22 }}>−</Text></Pressable>
                    <Text style={{ fontWeight: '600' }}>{n}</Text>
                    <Pressable onPress={() => addCart(id)} accessibilityLabel="Add one"><Text style={{ fontSize: 22 }}>+</Text></Pressable>
                  </View>
                </View>
              );
            })}
          </Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
            <Text style={{ fontSize: 16 }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{inr(total)}</Text>
          </View>
          <Btn label={`Pay ${inr(total)} from wallet`} onPress={() => { if (placeOrder()) router.replace('/orders'); }} />
          <Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 8 }}>Wallet balance {inr(wallet)}</Text>
        </>
      )}
    </Screen>
  );
}
