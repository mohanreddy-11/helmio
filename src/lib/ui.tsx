import React, { useEffect, useState } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from './theme';
import { BANNERS, Pod, useStore } from './store';
import { mmss } from './format';

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: 18 }}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export const H = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ marginBottom: 14 }, style]}><Text style={s.h}>{children}</Text></View>
);
export const Section = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.section}>{children}</Text>
);
export const Muted = ({ children, small }: { children: React.ReactNode; small?: boolean }) => (
  <Text style={{ color: C.muted, fontSize: small ? 13 : 15 }}>{children}</Text>
);
export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[s.card, style]}>{children}</View>
);
export const Empty = ({ children }: { children: React.ReactNode }) => (
  <View style={s.empty}><Text style={{ color: C.muted, textAlign: 'center' }}>{children}</Text></View>
);

export function Btn({
  label, onPress, kind = 'primary', disabled, small, style,
}: {
  label: string; onPress: () => void; kind?: 'primary' | 'ghost' | 'dark';
  disabled?: boolean; small?: boolean; style?: ViewStyle;
}) {
  const bg = kind === 'primary' ? C.uv1 : kind === 'dark' ? C.ink : C.surface;
  const fg = kind === 'ghost' ? C.ink : '#fff';
  return (
    <Pressable
      accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={[s.btn, small && { paddingVertical: 9, borderRadius: 11 },
        { backgroundColor: bg, borderColor: kind === 'ghost' ? C.line : bg, opacity: disabled ? 0.45 : 1 }, style]}>
      <Text style={{ color: fg, fontWeight: '600', fontSize: small ? 14 : 15 }}>{label}</Text>
    </Pressable>
  );
}

export function Field({ prefix, suffix, style, ...p }: TextInputProps & { prefix?: string; suffix?: string }) {
  return (
    <View style={s.field}>
      {prefix ? <Text style={{ color: C.muted }}>{prefix}</Text> : null}
      <TextInput placeholderTextColor={C.muted} style={[s.input, style]} {...p} />
      {suffix ? <Text style={{ color: C.muted }}>{suffix}</Text> : null}
    </View>
  );
}

export function Seg<T extends string>({
  options, value, onChange,
}: { options: { k: T; l: string }[]; value: T; onChange: (k: T) => void }) {
  return (
    <View style={s.seg}>
      {options.map(o => (
        <Pressable key={o.k} onPress={() => onChange(o.k)} accessibilityRole="button"
          style={[s.segBtn, value === o.k && s.segOn]}>
          <Text style={{ fontWeight: '500', color: value === o.k ? C.ink : C.muted }}>{o.l}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export const Chip = ({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[s.chip, on && { backgroundColor: C.ink, borderColor: C.ink }]}>
    <Text style={{ color: on ? '#fff' : C.muted, fontSize: 13.5 }}>{label}</Text>
  </Pressable>
);

export function StatusPill({ pod }: { pod: Pod }) {
  const m = pod.status === 'available'
    ? { bg: C.okBg, fg: C.ok, t: 'Available' }
    : pod.status === 'cycle'
      ? { bg: C.busyBg, fg: C.busy, t: `In cycle · ${mmss(pod.rem)}` }
      : { bg: C.offBg, fg: C.off, t: 'Offline' };
  return (
    <View style={[s.pill, { backgroundColor: m.bg }]}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: m.fg }} />
      <Text style={{ color: m.fg, fontSize: 12.5, fontWeight: '600' }}>{m.t}</Text>
    </View>
  );
}

export function Banner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(n => n + 1), 8000);
    return () => clearInterval(id);
  }, []);
  const b = BANNERS[i % BANNERS.length];
  return (
    <View style={s.banner}>
      <Text style={s.adTag}>Ad</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600', fontSize: 13.5, color: C.ink }}>{b.b}</Text>
        <Text style={{ fontSize: 13, color: C.muted }}>{b.t}</Text>
      </View>
    </View>
  );
}

export function Toast() {
  const msg = useStore(st => st.toastMsg);
  if (!msg) return null;
  return (
    <View pointerEvents="none" style={s.toastWrap}>
      <View style={s.toast}><Text style={{ color: '#fff', textAlign: 'center' }}>{msg}</Text></View>
    </View>
  );
}

export const s = StyleSheet.create({
  h: { fontSize: 26, fontWeight: '700', color: C.ink, letterSpacing: -0.3 },
  section: { fontSize: 16, fontWeight: '600', color: C.ink, marginTop: 22, marginBottom: 10 },
  card: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 14 },
  empty: { padding: 22, borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, borderRadius: 16 },
  btn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 13, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, marginBottom: 10 },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: C.ink },
  seg: { flexDirection: 'row', backgroundColor: C.line, borderRadius: 12, padding: 3, gap: 2 },
  segBtn: { flex: 1, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 9, alignItems: 'center' },
  segOn: { backgroundColor: C.surface },
  chip: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 99, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 99, alignSelf: 'flex-start' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line },
  adTag: { fontSize: 11, color: C.muted, borderWidth: 1, borderColor: C.line, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  toastWrap: { position: 'absolute', left: 18, right: 18, bottom: 100, alignItems: 'center' },
  toast: { backgroundColor: C.ink, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14 },
});
