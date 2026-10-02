import { create } from 'zustand';
import { haversine, offsetPoint } from './geo';

/* Placeholder pricing: confirm real numbers with Helmio */
export const CYCLE_PRICE = 30;
export const OWNER_CUT = 18;
export const CYCLE_SECS = 270; // 4.5 minutes
export const AD_REWARD = 5;
export const UNLOCK_FEE = 15;

export type Role = 'rider' | 'owner';
export type PodStatus = 'available' | 'cycle' | 'offline';
export type Pod = {
  id: number; name: string; area: string; dist: number;
  status: PodStatus; rem: number; mine: boolean;
  cycles: number; usage: number; bearing: number; lat?: number; lng?: number; byMe?: boolean;
};
export type Product = { id: string; name: string; price: number; icon: string };
export type Listing = { id: string; name: string; cond: string; price: number; seller: string; phone: string };
export type Order = { id: string; total: number; summary: string; ts: number };
export type Note = { id: number; title: string; body: string; ts: number };
export type Campaign = { id: number; adv: string; podId: number; rate: number; total: number };
export type Req = { id: number; podId: number; name: string; phone: string; msg: string; rate: number };
export type Txn = { id: number; t: string; amt: number; ts: number };

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Sanitizer refill, 250 ml', price: 149, icon: 'water-outline' },
  { id: 'p2', name: 'Sanitizer refill, 500 ml', price: 249, icon: 'water-outline' },
  { id: 'p3', name: 'Anti-fog visor insert', price: 299, icon: 'glasses-outline' },
  { id: 'p4', name: 'Riding gloves, pair', price: 449, icon: 'hand-left-outline' },
  { id: 'p5', name: 'Helmet lock', price: 399, icon: 'lock-closed-outline' },
  { id: 'p6', name: 'Visor wipes, pack of 20', price: 99, icon: 'sparkles-outline' },
];
export const LISTINGS: Listing[] = [
  { id: 'l1', name: 'Tinted visor, fits full-face', cond: 'Used, light scratches', price: 350, seller: 'Rohit', phone: '+91 90000 00123' },
  { id: 'l2', name: 'Cheek pads, medium', cond: 'Used, clean', price: 300, seller: 'Meera', phone: '+91 90000 00456' },
  { id: 'l3', name: 'Chin strap buckle', cond: 'Like new', price: 120, seller: 'Imran', phone: '+91 90000 00789' },
  { id: 'l4', name: 'Visor pivot kit', cond: 'Unused, spare', price: 180, seller: 'Kavya', phone: '+91 90000 00321' },
];
export const BANNERS = [
  { b: 'RideSure', t: 'Two-wheeler insurance renewed in 2 minutes' },
  { b: 'Torque Cafe', t: 'Free chai with any helmet clean on weekends' },
  { b: 'GripPro', t: 'Riding gloves, 20% off this week' },
];

export const cartTotal = (cart: Record<string, number>) =>
  Object.entries(cart).reduce((a, [id, n]) => a + (PRODUCTS.find(p => p.id === id)?.price ?? 0) * n, 0);

type State = {
  role: Role | null; loginRole: Role; phone: string;
  wallet: number; pods: Pod[]; cart: Record<string, number>;
  orders: Order[]; unlocked: Record<string, boolean>;
  notes: Note[]; unread: number; campaigns: Campaign[]; reqs: Req[]; txns: Txn[];
  profile: { name: string; upi: string; contact: string };
  toastMsg: string | null;
  userLoc: { lat: number; lng: number } | null;

  setUserLoc: (lat: number, lng: number) => void;
  setLoginRole: (r: Role) => void;
  signIn: (phone: string, role: Role) => void;
  signOut: () => void;
  toast: (m: string) => void;
  startCycle: (id: number) => boolean;
  sendInquiry: (podId: number, name: string, phone: string, msg: string) => void;
  addCart: (id: string) => void;
  removeCart: (id: string) => void;
  placeOrder: () => boolean;
  unlock: (id: string) => void;
  rewardAd: () => void;
  topup: () => void;
  acceptReq: (id: number, rate: number) => void;
  declineReq: (id: number) => void;
  markAlertsRead: () => void;
  saveProfile: (p: Partial<State['profile']>) => void;
  tick: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;
const txn = (t: string, amt: number): Txn => ({ id: Date.now() + Math.random(), t, amt, ts: Date.now() });

export const useStore = create<State>((set, get) => ({
  role: null, loginRole: 'rider', phone: '',
  wallet: 120,
  pods: [
    { id: 1, name: 'Tech Park, Tower C', area: 'Basement parking', dist: 120, status: 'available', rem: 0, mine: true, cycles: 14, usage: 252, bearing: 40 },
    { id: 2, name: 'Metro Station, Gate 2', area: 'Two-wheeler lot', dist: 340, status: 'cycle', rem: 95, mine: true, cycles: 11, usage: 198, bearing: 120 },
    { id: 3, name: 'Orbit Mall', area: 'Two-wheeler bay', dist: 620, status: 'available', rem: 0, mine: false, cycles: 0, usage: 0, bearing: 200 },
    { id: 4, name: 'Highway Fuel Stop', area: 'Beside pump 3', dist: 1400, status: 'cycle', rem: 40, mine: false, cycles: 0, usage: 0, bearing: 280 },
    { id: 5, name: 'University Main Gate', area: 'Parking entrance', dist: 2100, status: 'offline', rem: 0, mine: true, cycles: 3, usage: 54, bearing: 330 },
  ],
  cart: {}, orders: [], unlocked: {},
  notes: [
    { id: 1, title: 'Cycle completed', body: `Tech Park, Tower C finished a cycle. You earned ₹${OWNER_CUT}.`, ts: Date.now() - 12 * 60000 },
    { id: 2, title: 'New ad request', body: 'Anita Rao wants to advertise on University Main Gate.', ts: Date.now() - 50 * 60000 },
  ],
  unread: 0,
  campaigns: [
    { id: 1, adv: 'SafeMile Insurance', podId: 1, rate: 45, total: 1260 },
    { id: 2, adv: 'Torque Cafe', podId: 2, rate: 30, total: 720 },
  ],
  reqs: [
    { id: 1, podId: 5, name: 'Anita Rao', phone: '+91 90000 00456', msg: 'We run a two-wheeler service centre nearby and would like a rotating banner on this pod.', rate: 40 },
  ],
  txns: [{ id: 1, t: 'Welcome credit', amt: 120, ts: Date.now() - 86400000 }],
  profile: { name: '', upi: '', contact: '' },
  toastMsg: null,
  userLoc: null,

  // DEMO: until pods come from the backend with real coordinates, the first location fix
  // places each demo pod around the rider (at its seeded distance and bearing).
  // Distances are then recomputed from real coordinates on every update.
  setUserLoc: (lat, lng) => set(s => {
    const pods = s.pods.map(p => {
      const at = p.lat !== undefined && p.lng !== undefined
        ? { lat: p.lat, lng: p.lng }
        : offsetPoint({ lat, lng }, p.dist, p.bearing);
      return { ...p, lat: at.lat, lng: at.lng, dist: Math.round(haversine({ lat, lng }, at)) };
    });
    return { userLoc: { lat, lng }, pods };
  }),
  setLoginRole: r => set({ loginRole: r }),
  signIn: (phone, role) => set({ phone, role }),
  signOut: () => set({ role: null }),

  toast: m => {
    set({ toastMsg: m });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toastMsg: null }), 2600);
  },

  startCycle: id => {
    const s = get();
    const p = s.pods.find(x => x.id === id);
    if (!p || p.status !== 'available') return false;
    if (s.wallet < CYCLE_PRICE) { s.toast('Wallet is low. Add money or watch an ad.'); return false; }
    set({
      wallet: s.wallet - CYCLE_PRICE,
      txns: [txn(`Cycle at ${p.name}`, -CYCLE_PRICE), ...s.txns],
      pods: s.pods.map(x => (x.id === id ? { ...x, status: 'cycle' as PodStatus, rem: CYCLE_SECS, byMe: true } : x)),
    });
    s.toast(`Cycle started at ${p.name}`);
    return true;
  },

  sendInquiry: (podId, name, phone, msg) => {
    const s = get();
    const p = s.pods.find(x => x.id === podId);
    if (!p) return;
    const newNotes: Note[] = p.mine
      ? [{ id: Date.now(), title: 'New ad request', body: `${name} wants to advertise on ${p.name}.`, ts: Date.now() }]
      : [];
    set({
      reqs: [...s.reqs, { id: Date.now(), podId, name, phone, msg, rate: 40 }],
      notes: [...newNotes, ...s.notes],
      unread: s.unread + newNotes.length,
    });
    s.toast(`Request sent to the owner of ${p.name}`);
  },

  addCart: id => set(s => ({ cart: { ...s.cart, [id]: (s.cart[id] ?? 0) + 1 } })),
  removeCart: id => set(s => {
    const n = (s.cart[id] ?? 0) - 1;
    const cart = { ...s.cart };
    if (n <= 0) delete cart[id]; else cart[id] = n;
    return { cart };
  }),

  placeOrder: () => {
    const s = get();
    const total = cartTotal(s.cart);
    if (!total) return false;
    if (s.wallet < total) { s.toast(`Wallet is short by ${'₹' + (total - s.wallet)}. Add money first.`); return false; }
    const summary = Object.entries(s.cart)
      .map(([id, n]) => `${n} × ${PRODUCTS.find(p => p.id === id)?.name}`).join(', ');
    set({
      wallet: s.wallet - total,
      txns: [txn('Shop order', -total), ...s.txns],
      orders: [{ id: `#HM${1001 + s.orders.length}`, total, summary, ts: Date.now() }, ...s.orders],
      cart: {},
    });
    s.toast('Order placed. Helmio will deliver it.');
    return true;
  },

  unlock: id => {
    const s = get();
    const l = LISTINGS.find(x => x.id === id);
    if (!l || s.unlocked[id]) return;
    if (s.wallet < UNLOCK_FEE) { s.toast('Wallet is low. Add money or watch an ad.'); return; }
    set({
      wallet: s.wallet - UNLOCK_FEE,
      txns: [txn(`Unlocked contact: ${l.name}`, -UNLOCK_FEE), ...s.txns],
      unlocked: { ...s.unlocked, [id]: true },
    });
    s.toast('Seller contact unlocked');
  },

  rewardAd: () => {
    const s = get();
    set({ wallet: s.wallet + AD_REWARD, txns: [txn('Watched an ad', AD_REWARD), ...s.txns] });
    s.toast(`₹${AD_REWARD} added to your wallet`);
  },
  topup: () => {
    const s = get();
    set({ wallet: s.wallet + 100, txns: [txn('Top-up (demo)', 100), ...s.txns] });
    s.toast('₹100 added');
  },

  acceptReq: (id, rate) => {
    const s = get();
    const r = s.reqs.find(x => x.id === id);
    if (!r) return;
    set({
      campaigns: [...s.campaigns, { id: Date.now(), adv: r.name, podId: r.podId, rate, total: 0 }],
      reqs: s.reqs.filter(x => x.id !== id),
    });
    s.toast(`Accepted. ${r.name} is now live.`);
  },
  declineReq: id => { const s = get(); set({ reqs: s.reqs.filter(x => x.id !== id) }); s.toast('Request declined'); },

  markAlertsRead: () => set({ unread: 0 }),
  saveProfile: p => { set(s => ({ profile: { ...s.profile, ...p } })); get().toast('Changes saved'); },

  tick: () => {
    const s = get();
    if (!s.pods.some(p => p.status === 'cycle')) return;
    const newNotes: Note[] = [];
    let ready = '';
    const pods = s.pods.map(p => {
      if (p.status !== 'cycle') return p;
      const rem = p.rem - 1;
      if (rem > 0) return { ...p, rem };
      if (p.byMe) ready = p.name;
      if (p.mine) newNotes.push({ id: Date.now() + p.id, title: 'Cycle completed', body: `${p.name} finished a cycle. You earned ₹${OWNER_CUT}.`, ts: Date.now() });
      return {
        ...p, status: 'available' as PodStatus, rem: 0, byMe: false,
        cycles: p.mine ? p.cycles + 1 : p.cycles,
        usage: p.mine ? p.usage + OWNER_CUT : p.usage,
      };
    });
    set({ pods, notes: [...newNotes, ...s.notes], unread: s.unread + newNotes.length });
    if (ready) s.toast(`Your helmet at ${ready} is ready`);
  },
}));
