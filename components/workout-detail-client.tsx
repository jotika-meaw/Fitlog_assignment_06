"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Check, Clock3, Dumbbell, Flame, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import Navbar from "./navbar";
import Footer from "./footer";
import { useWorkouts } from "./workout-provider";
import type { Workout } from "@/lib/types";

function fallbackImage(name: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1000">
      <rect width="100%" height="100%" fill="#151a15"/>
      <circle cx="720" cy="160" r="220" fill="#caff00" opacity=".1"/>
      <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" fill="#caff00" font-family="Arial" font-size="46" font-weight="900">${name.slice(0,22)}</text>
      <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#697168" font-family="Arial" font-size="15" letter-spacing="3">FITLOG TRAINING</text>
    </svg>`)}`
}

export default function WorkoutDetailClient({ id }: { id: string }) {
  const { workouts, loading, addToPlan, saveForLater, plan, saved } = useWorkouts();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    setWorkout(workouts.find(w => String(w.id) === String(id)) ?? null);
  }, [workouts, id]);

  const alreadyPlanned = useMemo(() => !!workout && plan.some(w => w.id === workout.id), [workout, plan]);
  const alreadySaved = useMemo(() => !!workout && saved.some(w => w.id === workout.id), [workout, saved]);

  if (loading) return <main className="page-shell"><Navbar/><div className="loading-screen"><div className="loader-ring"/><p>LOADING WORKOUT…</p></div></main>;
  if (!workout) return <main className="page-shell"><Navbar/><div className="not-found"><span className="eyebrow">WORKOUT NOT FOUND</span><h1>NO SUCH LIFT.</h1><p>This workout is not present in the current library.</p><Link href="/" className="button button-primary"><ArrowLeft size={16}/> BACK TO LIBRARY</Link></div><Footer/></main>;

  const add = () => {
    if (alreadyPlanned) return toast.info("Already in today's plan");
    if (plan.length >= 5) return toast.error("Today's plan is full (5 lifts max)");
    addToPlan(workout); toast.success("Added to today's plan");
  };
  const save = () => {
    if (alreadySaved) return toast.info("Already saved for later");
    saveForLater(workout); toast.success("Saved for later");
  };

  return (
    <main className="page-shell">
      <Navbar/>
      <section className="detail">
        <div className="container">
          <Link href="/" className="eyebrow" style={{marginBottom:22}}><ArrowLeft size={13}/> BACK TO LIBRARY</Link>
          <div className="detail-grid">
            <div className="detail-media"><img src={workout.image || fallbackImage(workout.name)} alt={workout.name}/></div>
            <div className="detail-content">
              <div className="tags">{workout.categories.map(tag => <span className="tag" key={tag}>{tag.toUpperCase()}</span>)}</div>
              <h1 className="display">{workout.name}</h1>
              <p className="detail-desc">{workout.description}</p>

              <div className="specs">
                {[
                  ["EQUIPMENT",workout.equipment],["DIFFICULTY",workout.difficulty],["SETS",workout.sets],
                  ["REPS",workout.reps],["DURATION",`${workout.duration} min`],["CALORIES",`${workout.calories} kcal`],["RATING",workout.rating]
                ].map(([label,value]) => <div className="spec-row" key={String(label)}><span className="spec-label">{label}</span><span className="spec-value">{value}</span></div>)}
              </div>

              <div className="instructions">
                <h3>INSTRUCTIONS</h3>
                <ol className="instruction-list">
                  {workout.instructions.slice(0,4).map((step,i)=><li key={i}><span className="step">{i+1}</span><span>{step}</span></li>)}
                </ol>
              </div>

              <div className="detail-actions">
                <button className="button button-primary" onClick={add} disabled={alreadyPlanned || plan.length >= 5}><Plus size={16}/>{alreadyPlanned ? "IN TODAY'S PLAN" : "ADD TO TODAY'S PLAN"}</button>
                <button className="button button-secondary" onClick={save} disabled={alreadySaved}><Bookmark size={16}/>{alreadySaved ? "SAVED" : "SAVE FOR LATER"}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
