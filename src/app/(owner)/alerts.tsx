import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Card, Empty, H, Muted, Screen } from '@/lib/ui';
import { useStore } from '@/lib/store';
import { ago } from '@/lib/format';
import { C } from '@/lib/theme';

export default function Alerts() {
  const notes = useStore(s => s.notes);
  const markAlertsRead = useStore(s => s.markAlertsRead);
  useFocusEffect(useCallback(() => { markAlertsRead(); }, [markAlertsRead]));

  return (
    <Screen>
      <H>Alerts</H>
      {notes.length === 0 ? <Empty>Alerts appear here when a pod finishes a cycle.</Empty> : (
        <Card>
          {notes.map(n => (
            <View key={n.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <Text style={{ fontWeight: '600', color: C.ink }}>{n.title}</Text>
              <Muted small>{n.body}</Muted>
              <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{ago(n.ts)}</Text>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}
