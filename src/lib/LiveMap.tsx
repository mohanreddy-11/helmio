// Web version (browser). Phones use LiveMap.native.tsx automatically.
import React, { useEffect, useMemo, useRef } from 'react';
import type { Pod } from './store';
import { MAP_HTML, MapUser, buildPayload } from './mapHtml';

type Props = { user: MapUser; pods: Pod[]; onPodPress: (id: number) => void; height?: number };

export default function LiveMap({ user, pods, onPodPress, height = 300 }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const ready = useRef(false);
  const payload = useMemo(() => buildPayload(user, pods), [user, pods]);
  const latest = useRef(payload);
  const press = useRef(onPodPress);
  latest.current = payload;
  press.current = onPodPress;

  const push = () => frame.current?.contentWindow?.postMessage(latest.current, '*');

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      try {
        const m = JSON.parse(e.data);
        if (m.type === 'ready') { ready.current = true; push(); }
        if (m.type === 'podPress') press.current(m.id);
      } catch { /* ignore other messages */ }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => { if (ready.current) push(); }, [payload]);

  return (
    <iframe
      ref={frame}
      srcDoc={MAP_HTML}
      title="Map of nearby pods"
      style={{ width: '100%', height, border: 0, borderRadius: 20, display: 'block' }}
    />
  );
}
