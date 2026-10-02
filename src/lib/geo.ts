export type LatLng = { lat: number; lng: number };
const R = 6371000; // metres
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Straight-line distance in metres between two coordinates. */
export function haversine(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The point `distM` metres from `from`, heading `bearingDeg` (0 = north). */
export function offsetPoint(from: LatLng, distM: number, bearingDeg: number): LatLng {
  const b = rad(bearingDeg);
  const d = distM / R;
  const p1 = rad(from.lat);
  const l1 = rad(from.lng);
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
  const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return { lat: deg(p2), lng: deg(l2) };
}
