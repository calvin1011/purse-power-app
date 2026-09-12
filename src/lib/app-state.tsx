import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  TOTAL_DEALS_USED,
  TOTAL_RECEIPTS,
  TOTAL_SAVED,
  receipts as seedReceipts,
} from "./mock-data";
import type { Receipt } from "./mock-data";
import type { RegularCategory, RegularItem } from "./mock-data";

type State = {
  name: string | null;
  email: string | null;
  theme: "dark" | "light";
  receipts: Receipt[];
  savedDeals: string[];
  extraSaved: number;
  goal: number;
  onboarded: boolean;
  readNotifs: string[];
  locationOn: boolean;
  pausedRegulars: string[];
  addedRegulars: string[];
  manualRegulars: RegularItem[];
  dismissedSuggestions: string[];
  regularsIntroSeen: boolean;
};

type Ctx = State & {
  totalSaved: number;
  receiptCount: number;
  dealsUsed: number;
  setAccount: (name: string, email: string) => void;
  signOut: () => void;
  toggleTheme: () => void;
  toggleDeal: (id: string) => void;
  addReceipt: (r: Receipt) => void;
  setGoal: (n: number) => void;
  completeOnboarding: () => void;
  markAllNotifsRead: (ids: string[]) => void;
  markNotifRead: (id: string) => void;
  setLocationOn: (v: boolean) => void;
  toggleRegular: (id: string) => void;
  addRegular: (id: string) => void;
  addManualRegular: (name: string, category: RegularCategory) => void;
  dismissRegularSuggestion: (id: string) => void;
  dismissRegularsIntro: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

const KEY = "sift-state-v1";

const initial: State = {
  name: null,
  email: null,
  theme: "dark",
  receipts: seedReceipts,
  savedDeals: ["d1"],
  extraSaved: 0,
  goal: 60,
  onboarded: false,
  readNotifs: ["n-6", "n-7"],
  locationOn: true,
  pausedRegulars: [],
  addedRegulars: [],
  manualRegulars: [],
  dismissedSuggestions: [],
  regularsIntroSeen: false,
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw), receipts: s.receipts }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const { receipts: _r, ...rest } = state;
      localStorage.setItem(KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.classList.toggle("dark", state.theme === "dark");
    root.classList.toggle("light", state.theme === "light");
  }, [state]);

  const setAccount = useCallback((name: string, email: string) => {
    setState((s) => ({ ...s, name, email }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      totalSaved: TOTAL_SAVED + state.extraSaved,
      receiptCount: TOTAL_RECEIPTS + (state.receipts.length - seedReceipts.length),
      dealsUsed: TOTAL_DEALS_USED,
      setAccount,
      signOut: () => setState((s) => ({ ...s, name: null, email: null })),
      toggleTheme: () =>
        setState((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" })),
      toggleDeal: (id) =>
        setState((s) => ({
          ...s,
          savedDeals: s.savedDeals.includes(id)
            ? s.savedDeals.filter((d) => d !== id)
            : [...s.savedDeals, id],
        })),
      addReceipt: (r) =>
        setState((s) => {
          if (s.receipts.some((x) => x.id === r.id)) return s;
          const found = r.savings.reduce((a, b) => a + b.amount, 0);
          return { ...s, receipts: [r, ...s.receipts], extraSaved: s.extraSaved + found };
        }),
      setGoal: (n) => setState((s) => ({ ...s, goal: n })),
      completeOnboarding: () => setState((s) => ({ ...s, onboarded: true })),
      markAllNotifsRead: (ids) =>
        setState((s) => ({ ...s, readNotifs: Array.from(new Set([...s.readNotifs, ...ids])) })),
      markNotifRead: (id) =>
        setState((s) => ({
          ...s,
          readNotifs: s.readNotifs.includes(id) ? s.readNotifs : [...s.readNotifs, id],
        })),
      setLocationOn: (v) => setState((s) => ({ ...s, locationOn: v })),
      toggleRegular: (id) =>
        setState((s) => ({
          ...s,
          pausedRegulars: s.pausedRegulars.includes(id)
            ? s.pausedRegulars.filter((itemId) => itemId !== id)
            : [...s.pausedRegulars, id],
        })),
      addRegular: (id) =>
        setState((s) => ({
          ...s,
          addedRegulars: s.addedRegulars.includes(id) ? s.addedRegulars : [...s.addedRegulars, id],
        })),
      addManualRegular: (name, category) =>
        setState((s) => ({
          ...s,
          manualRegulars: [
            ...s.manualRegulars,
            {
              id: `manual-${Date.now()}`,
              category,
              name,
              averagePrice: 0,
              frequency: "Tracking starts now",
            },
          ],
        })),
      dismissRegularSuggestion: (id) =>
        setState((s) => ({
          ...s,
          dismissedSuggestions: s.dismissedSuggestions.includes(id)
            ? s.dismissedSuggestions
            : [...s.dismissedSuggestions, id],
        })),
      dismissRegularsIntro: () => setState((s) => ({ ...s, regularsIntroSeen: true })),
    }),
    [state, setAccount],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}
