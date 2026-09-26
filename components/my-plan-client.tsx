"use client";

import Link from "next/link";
import { Check, Clock3, ExternalLink, Flame, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { useWorkouts } from "./workout-provider";
import type { Workout, PlanItem } from "@/lib/types";

function imageFor(w: Workout) {
  if (w.image) return w.image;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="460"><rect width="100%" height="100%" fill="#151a15"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#caff00" font-family="Arial" font-size="30" font-weight="900">${w.name.slice(0,20)}</text></svg>`)}`;
}

function PlanCard({ workout, onRemove, onDone, savedTab }: { workout: PlanItem | Workout; onRemove:()=>void; onDone?:()=>void; savedTab?:boolean }) {
  const done = "done" in workout && workout.done;
  return (
    <article className="plan-card">
      <div className="plan-thumb"><img src={imageFor(workout)} alt={workout.name}/></div>
      <div className="plan-info">
        <h3>{workout.name}</h3>
        <p>{workout.equipment}</p>
        <div className="stats" style={{paddingTop:9,marginTop:9,borderTop:0}}>
          <span className="stat"><Clock3 size={12}/> {workout.duration} min</span>
          <span className="stat"><Flame size={12}/> {workout.calories} kcal</span>
          <span className="stat">★ {workout.rating}</span>
        </div>
        {done && <div className="done-badge"><Check size={12} style={{verticalAlign:"middle"}}/> DONE</div>}
      </div>
      <div className="plan-actions">
        <Link href={`/workout/${workout.id}`} className="button button-secondary"><ExternalLink size={14}/> VIEW DETAILS</Link>
        {!savedTab && onDone && <button className="button button-primary" onClick={onDone} disabled={!!done}><Check size={14}/> {done ? "DONE" : "MARK AS DONE"}</button>}
        <button className="icon-button" title={savedTab ? "Remove saved workout" : "Remove from today's plan"} onClick={onRemove}><X size={16}/></button>
      </div>
    </article>
  );
}

export default function MyPlanClient() {
  const { plan, saved, removeFromPlan, removeSaved, markDone } = useWorkouts();
  const [tab, setTab] = useState<"plan"|"saved">("plan");
  const minutes = plan.reduce((sum,w)=>sum+w.duration,0);
  const calories = plan.reduce((sum,w)=>sum+w.calories,0);
  const list = tab === "plan" ? plan : saved;

  return (
    <main className="page-shell">
      <Navbar/>
      <section className="plan-page">
        <div className="container">
          <div className="page-title">
            <span className="eyebrow">TRAINING LOG</span>
            <h1 className="display">MY PLAN</h1>
            <p className="section-sub">Cap of five lifts for today. Finish them, then load more.</p>
          </div>

          <div className="metrics">
            <div className="metric"><span className="metric-label">EXERCISES</span><span className="metric-value">{plan.length}</span></div>
            <div className="metric"><span className="metric-label">MINUTES</span><span className="metric-value">{minutes}</span></div>
            <div className="metric"><span className="metric-label">CALORIES</span><span className="metric-value">{calories}</span></div>
          </div>

          <div className="tabs">
            <button className={`tab ${tab==="plan"?"active":""}`} onClick={()=>setTab("plan")}>TODAY&apos;S PLAN ({plan.length})</button>
            <button className={`tab ${tab==="saved"?"active":""}`} onClick={()=>setTab("saved")}>SAVED ({saved.length})</button>
          </div>

          {list.length === 0 ? (
            <div className="empty-state">
              <div>
                <span className="eyebrow">EMPTY LOG</span>
                <h2 className="display">NOTHING HERE YET</h2>
                <p>Browse the library and add a lift to get today moving.</p>
                <Link href="/" className="button button-primary">GO TO WORKOUTS</Link>
              </div>
            </div>
          ) : (
            <div className="plan-list">
              {list.map(w => <PlanCard key={w.id} workout={w} savedTab={tab==="saved"}
                onRemove={()=>{tab==="plan"?removeFromPlan(w.id):removeSaved(w.id); toast.success(tab==="plan"?"Removed from today's plan":"Removed from saved");}}
                onDone={tab==="plan"?()=>{markDone(w.id);toast.success(`${w.name} marked as done`);}:undefined}
              />)}
            </div>
          )}
        </div>
      </section>
      <Footer/>
    </main>
  );
}
