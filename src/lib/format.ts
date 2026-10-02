export const inr = (n: number) =>
  `${n < 0 ? '-' : ''}₹${Math.abs(n).toLocaleString('en-IN')}`;

export const mmss = (s: number) => {
  const v = Math.max(0, Math.round(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`;
};

export const distLabel = (m: number) =>
  m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;

export const ago = (ts: number) => {
  const s = (Date.now() - ts) / 1000;
  if (s < 45) return 'Just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return `${Math.round(s / 3600)} h ago`;
};
