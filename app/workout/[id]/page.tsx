import WorkoutDetailClient from "@/components/workout-detail-client";

export default function WorkoutPage({ params }: { params: { id: string } }) {
  return <WorkoutDetailClient id={params.id} />;
}
