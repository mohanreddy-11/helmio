import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useStore } from './store';

export type LocStatus = 'checking' | 'undetermined' | 'granted' | 'denied';

/**
 * Asks for foreground location, then keeps the store's userLoc updated as the rider moves.
 * Works on phone (Expo Go) and in the browser.
 */
export function useUserLocation() {
  const setUserLoc = useStore(s => s.setUserLoc);
  const [status, setStatus] = useState<LocStatus>('checking');
  const sub = useRef<Location.LocationSubscription | null>(null);

  const start = useCallback(async () => {
    sub.current?.remove();
    try {
      const first = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLoc(first.coords.latitude, first.coords.longitude);
      sub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 5000 },
        l => setUserLoc(l.coords.latitude, l.coords.longitude),
      );
    } catch {
      useStore.getState().toast("Couldn't get your location. Check that location is turned on.");
    }
  }, [setUserLoc]);

  const request = useCallback(async () => {
    const r = await Location.requestForegroundPermissionsAsync();
    if (r.granted) { setStatus('granted'); await start(); } else { setStatus('denied'); }
  }, [start]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await Location.getForegroundPermissionsAsync();
      if (!alive) return;
      if (p.granted) { setStatus('granted'); start(); }
      else setStatus(p.canAskAgain === false ? 'denied' : 'undetermined');
    })();
    return () => { alive = false; sub.current?.remove(); };
  }, [start]);

  return { status, request };
}
