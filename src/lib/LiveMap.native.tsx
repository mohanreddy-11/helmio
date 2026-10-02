// Phone version (Expo Go, iOS and Android). Browsers use LiveMap.tsx.
import React, { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { Pod } from './store';
import { MAP_HTML, MapUser, buildPayload } from './mapHtml';

type Props = { user: MapUser; pods: Pod[]; onPodPress: (id: number) => void; height?: number };

export default function LiveMap({ user, pods, onPodPress, height = 300 }: Props) {
  const ref = useRef<WebView>(null);
  const ready = useRef(false);
  const payload = useMemo(() => buildPayload(user, pods), [user, pods]);
  const latest = useRef(payload);
  const press = useRef(onPodPress);
  latest.current = payload;
  press.current = onPodPress;

  const push = () => ref.current?.injectJavaScript(`window.__update(${latest.current});true;`);

  useEffect(() => { if (ready.current) push(); }, [payload]);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const m = JSON.parse(e.nativeEvent.data);
      if (m.type === 'ready') { ready.current = true; push(); }
      if (m.type === 'podPress') press.current(m.id);
    } catch { /* ignore */ }
  };

  return (
    <View style={{ height, borderRadius: 20, overflow: 'hidden' }}>
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={{ html: MAP_HTML }}
        onMessage={onMessage}
        javaScriptEnabled
        nestedScrollEnabled
        style={{ flex: 1 }}
      />
    </View>
  );
}
