"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PlanItem, Workout } from "@/lib/types";
import { fallback } from "@/lib/workouts";

type ContextValue = {
  workouts: Workout[];
  loading: boolean;
  apiError: boolean;
  plan: PlanItem[];
  saved: Workout[];
  addToPlan: (w: Workout) => boolean;
  saveForLater: (w: Workout) => boolean;
  removeFromPlan: (id: string) => void;
  removeSaved: (id: string) => void;
  markDone: (id: string) => void;
};

const Ctx = createContext<ContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);

  useEffect(() => {
    try {
      const p = localStorage.getItem("fitlog-plan");
      const s = localStorage.getItem("fitlog-saved");
      if (p) setPlan(JSON.parse(p));
      if (s) setSaved(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("fitlog-plan", JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem("fitlog-saved", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    let alive = true;
    fetch("https://api.api-store.workers.dev/api/fitlog", { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const rows = Array.isArray(data) ? data : data?.data ?? data?.workouts ?? data?.results ?? [];
        if (alive && rows.length) {
          import("@/lib/workouts").then(({ normalizeWorkout }) => {
            setWorkouts(rows.map((x:any, i:number) => normalizeWorkout(x, i)));
            setLoading(false);
          });
        } else {
          if (alive) { setWorkouts(fallback); setApiError(true); setLoading(false); }
        }
      })
      .catch(() => {
        if (alive) { setWorkouts(fallback); setApiError(true); setLoading(false); }
      });
    return () => { alive = false; };
  }, []);

  const value = useMemo<ContextValue>(() => ({
    workouts, loading, apiError, plan, saved,
    addToPlan: (w) => {
      if (plan.some(x => x.id === w.id) || plan.length >= 5) return false;
      setPlan(prev => [...prev, { ...w, done: false }]);
      return true;
    },
    saveForLater: (w) => {
      if (saved.some(x => x.id === w.id)) return false;
      setSaved(prev => [...prev, w]);
      return true;
    },
    removeFromPlan: (id) => setPlan(prev => prev.filter(x => x.id !== id)),
    removeSaved: (id) => setSaved(prev => prev.filter(x => x.id !== id)),
    markDone: (id) => setPlan(prev => prev.map(x => x.id === id ? { ...x, done: true } : x)),
  }), [workouts, loading, apiError, plan, saved]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkouts() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useWorkouts must be used inside WorkoutProvider");
  return value;
}
