import Link from "next/link";
import { Clock3, Flame, Star } from "lucide-react";
import type { Workout } from "@/lib/types";

function fallbackImage(name: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540">
      <rect width="100%" height="100%" fill="#151a15"/>
      <circle cx="700" cy="100" r="180" fill="#caff00" opacity=".09"/>
      <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle"
        fill="#caff00" font-family="Arial" font-size="42" font-weight="900">${name.slice(0,24)}</text>
      <text x="50%" y="61%" dominant-baseline="middle" text-anchor="middle"
        fill="#697168" font-family="Arial" font-size="15" letter-spacing="3">FITLOG TRAINING</text>
    </svg>`)}`
}

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link href={`/workout/${workout.id}`} className="workout-card">
      <div className="card-image">
        <img src={workout.image || fallbackImage(workout.name)} alt={workout.name} />
      </div>
      <div className="card-body">
        <div className="tags">
          {workout.categories.slice(0,3).map(tag => <span className="tag" key={tag}>{tag.toUpperCase()}</span>)}
        </div>
        <div className="card-title">{workout.name}</div>
        <div className="equipment">{workout.equipment}</div>
        <div className="stats">
          <span className="stat"><Clock3 size={12}/> {workout.duration} min</span>
          <span className="stat"><Flame size={12}/> {workout.calories} kcal</span>
          <span className="stat"><Star size={12}/> {workout.rating}</span>
        </div>
      </div>
    </Link>
  );
}
