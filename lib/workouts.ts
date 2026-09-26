import type { Workout } from "./types";

export const API_URL = "https://api.api-store.workers.dev/api/fitlog";

const fallback: Workout[] = [
  ["1","Barbell Bench Press","A compound press that builds chest thickness, triceps, and pressing power from a stable bench.",["Chest","Arms"],"Barbell, Bench","Intermediate",4,"6-8",25,180,4.8],
  ["2","Back Squat","A foundational lower-body lift focused on quads, glutes, and total-body strength.",["Legs","Glutes"],"Barbell, Rack","Intermediate",4,"6-8",32,240,4.9],
  ["3","Deadlift","A powerful posterior-chain movement for building back, glutes, hamstrings, and grip strength.",["Back","Legs"],"Barbell","Advanced",3,"5-6",28,260,4.9],
  ["4","Pull Up","A bodyweight pulling movement that develops lats, upper back, and arm strength.",["Back","Arms"],"Pull-up Bar","Intermediate",4,"6-10",20,150,4.7],
  ["5","Overhead Press","A strict vertical press that targets shoulders and triceps while demanding core stability.",["Shoulders","Arms"],"Barbell","Intermediate",4,"6-8",22,145,4.6],
  ["6","Romanian Deadlift","A controlled hip hinge that emphasizes hamstrings and glutes through a long range of motion.",["Legs","Glutes"],"Barbell","Intermediate",3,"8-10",24,190,4.8],
  ["7","Barbell Row","A horizontal pull for mid-back thickness, lats, rear delts, and grip.",["Back","Arms"],"Barbell","Intermediate",4,"8-10",21,160,4.7],
  ["8","Dumbbell Lateral Raise","A focused shoulder isolation movement designed to build lateral deltoid strength.",["Shoulders"],"Dumbbells","Beginner",3,"12-15",15,90,4.5],
  ["9","Dumbbell Curl","A simple arm-builder targeting the biceps with controlled elbow flexion.",["Arms"],"Dumbbells","Beginner",3,"10-12",14,80,4.6],
  ["10","Cable Triceps Pushdown","A stable cable isolation exercise for triceps volume and lockout strength.",["Arms"],"Cable Machine","Beginner",3,"10-15",14,75,4.6],
  ["11","Russian Twist","A seated rotational core exercise that challenges the abs and obliques.",["Core"],"Medicine Ball","Intermediate",3,"16-20",12,70,4.4],
  ["12","Plank","An isometric core hold that trains trunk stiffness and total-body control.",["Core"],"Bodyweight","Beginner",3,"30-60 sec",10,55,4.7]
].map(([id,name,description,categories,equipment,difficulty,sets,reps,duration,calories,rating]) => ({
  id, name, description, categories, equipment, difficulty, sets, reps, duration, calories, rating,
  image: "",
  instructions: [
    "Set up with a stable position and brace your core before starting.",
    "Move through the exercise with controlled tempo and full range of motion.",
    "Keep your breathing steady and maintain the intended posture throughout the set.",
    "Finish the final repetition under control, then reset before the next set."
  ]
})) as Workout[];

const str = (v: any, fallbackValue = "") => v == null ? fallbackValue : String(v);
const num = (v: any, fallbackValue = 0) => {
  const n = Number.parseFloat(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : fallbackValue;
};

function pick(obj: any, keys: string[], fallbackValue?: any) {
  for (const key of keys) if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key];
  return fallbackValue;
}

export function normalizeWorkout(raw: any, index: number): Workout {
  const categories = pick(raw, ["categories","category","muscle_groups","muscleGroups","tags"], []);
  const instructions = pick(raw, ["instructions","steps","how_to"], []);
  const image = pick(raw, ["image","image_url","imageUrl","thumbnail","photo","img","url"], "");
  const name = pick(raw, ["name","title","workout_name","exercise"], `Workout ${index + 1}`);

  return {
    id: str(pick(raw, ["id","_id","workout_id"], index + 1)),
    name: str(name).toUpperCase(),
    description: str(pick(raw, ["description","desc","summary"], "A focused training movement designed to build strength with controlled technique.")),
    categories: Array.isArray(categories) ? categories.map((x:any) => str(x)) : str(categories).split(",").map(x => x.trim()).filter(Boolean),
    equipment: str(pick(raw, ["equipment","equipment_name","tools"], "Gym Equipment")),
    difficulty: str(pick(raw, ["difficulty","level"], "Intermediate")),
    sets: Math.round(num(pick(raw, ["sets","set"], 3), 3)),
    reps: str(pick(raw, ["reps","rep","repetitions"], "8-12")),
    duration: Math.round(num(pick(raw, ["duration","duration_minutes","minutes"], 20), 20)),
    calories: Math.round(num(pick(raw, ["calories","kcal","calories_burned"], 120), 120)),
    rating: num(pick(raw, ["rating","score","stars"], 4.7), 4.7),
    image: str(image),
    instructions: Array.isArray(instructions) && instructions.length
      ? instructions.map((x:any) => typeof x === "string" ? x : str(x?.text ?? x?.instruction ?? x))
      : [
        "Set up with a stable position and brace your core before starting.",
        "Move through the exercise with controlled tempo and full range of motion.",
        "Keep your breathing steady and maintain the intended posture throughout the set.",
        "Finish the final repetition under control, then reset before the next set."
      ]
  };
}

export async function getWorkouts(): Promise<Workout[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`FitLog API returned ${res.status}`);
  const data = await res.json();
  const rows = Array.isArray(data) ? data : data?.data ?? data?.workouts ?? data?.results ?? [];
  return rows.map(normalizeWorkout).filter(Boolean);
}

export function getFallbackWorkouts() { return fallback; }
export { fallback };
