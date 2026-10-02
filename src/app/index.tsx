import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Field, Screen, Seg } from '@/lib/ui';
import { C } from '@/lib/theme';
import { useStore } from '@/lib/store';

export default function Login() {
  const router = useRouter();
  const { loginRole, setLoginRole, signIn, toast } = useStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);

  const sendOtp = () => {
    if (phone.length !== 10) return toast('Enter a 10-digit mobile number');
    // TODO: call your backend / SMS provider here
    setSent(true);
  };
  const verify = () => {
    if (otp.length !== 4) return toast('Enter the 4-digit code');
    // TODO: verify the code with your backend. The prototype accepts any 4 digits.
    signIn(phone, loginRole);
    router.replace(loginRole === 'rider' ? '/(rider)/pods' : '/(owner)/home');
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 18 }}>
        <View style={{ width: 92, height: 120, borderRadius: 26, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, alignItems: 'center', paddingTop: 16 }}>
          <View style={{ width: 52, height: 7, borderRadius: 4, backgroundColor: C.uv1, marginBottom: 26 }} />
          <View style={{ width: 44, height: 40, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: C.ink }} />
        </View>
        <Text style={{ marginTop: 14, color: C.muted, fontWeight: '600', letterSpacing: 0.4 }}>Helmio</Text>
      </View>
      <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', color: C.ink, letterSpacing: -0.3 }}>
        Your helmet, clean in under 4.5 minutes
      </Text>
      <Text style={{ textAlign: 'center', color: C.muted, marginTop: 8, marginBottom: 22 }}>
        Log in to find a pod, or to manage yours.
      </Text>

      <View style={{ marginBottom: 14 }}>
        <Seg options={[{ k: 'rider', l: 'Rider' }, { k: 'owner', l: 'Pod owner' }]} value={loginRole} onChange={setLoginRole} />
      </View>

      {!sent ? (
        <>
          <Field prefix="+91" value={phone} onChangeText={t => setPhone(t.replace(/\D/g, ''))}
            keyboardType="number-pad" maxLength={10} placeholder="10-digit number" />
          <Btn label="Send code" onPress={sendOtp} />
        </>
      ) : (
        <>
          <Text style={{ color: C.muted, marginBottom: 6 }}>Code sent to +91 {phone}</Text>
          <Field value={otp} onChangeText={t => setOtp(t.replace(/\D/g, ''))} keyboardType="number-pad"
            maxLength={4} placeholder="····" textContentType="oneTimeCode" style={{ textAlign: 'center', letterSpacing: 10, fontSize: 22 }} />
          <Btn label="Verify and continue" onPress={verify} />
          <View style={{ height: 8 }} />
          <Btn kind="ghost" label="Change number" onPress={() => setSent(false)} />
          <Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 10 }}>Prototype: any 4 digits work.</Text>
        </>
      )}
    </Screen>
  );
}
