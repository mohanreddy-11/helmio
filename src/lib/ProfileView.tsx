import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Card, Field, H, Screen } from './ui';
import { C } from './theme';
import { useStore } from './store';

export default function ProfileView() {
  const router = useRouter();
  const { role, phone, profile, saveProfile, signOut } = useStore();
  const owner = role === 'owner';
  const [name, setName] = useState(profile.name);
  const [upi, setUpi] = useState(profile.upi);
  const [contact, setContact] = useState(profile.contact);

  return (
    <Screen>
      <H>Profile</H>
      <Card style={{ marginBottom: 14 }}>
        <Text style={{ color: C.muted, fontSize: 12 }}>Signed in as</Text>
        <Text style={{ fontWeight: '600', color: C.ink }}>+91 {phone}  ·  {owner ? 'Pod owner' : 'Rider'}</Text>
      </Card>
      <Text style={{ color: C.muted, fontSize: 13, marginBottom: 5 }}>Name</Text>
      <Field value={name} onChangeText={setName} placeholder="Your name" />
      {owner && (
        <>
          <Text style={{ color: C.muted, fontSize: 13, marginBottom: 5 }}>Payout UPI ID</Text>
          <Field value={upi} onChangeText={setUpi} placeholder="name@bank" autoCapitalize="none" />
          <Text style={{ color: C.muted, fontSize: 13, marginBottom: 5 }}>Contact for advertisers</Text>
          <Field value={contact} onChangeText={setContact} placeholder="Email or phone" autoCapitalize="none" />
        </>
      )}
      <Btn label="Save changes" onPress={() => saveProfile(owner ? { name, upi, contact } : { name })} />
      <View style={{ height: 10 }} />
      <Btn kind="ghost" label="Sign out" onPress={() => { signOut(); router.replace('/'); }} />
    </Screen>
  );
}
