"use client";

import Link from "next/link";
import { Dumbbell, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWorkouts } from "./workout-provider";

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = useWorkouts();

  const isWorkoutPage =
    pathname === "/" || pathname.startsWith("/workout/");

  const isPlanPage = pathname.startsWith("/my-plan");

  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="logo-mark">
            <Dumbbell size={17} strokeWidth={2.8} />
          </span>
          <span>FITLOG</span>
        </Link>

        <nav className="nav-links">
          <Link
            href="/"
            className={`nav-link ${
              isWorkoutPage ? "active" : ""
            }`}
          >
            Workouts
          </Link>

          <Link
            href="/my-plan?tab=plan"
            className={`nav-link ${
              isPlanPage ? "active" : ""
            }`}
          >
            My Plan
          </Link>
        </nav>

        <div className="nav-status">
          {/* TODAY'S PLAN */}
          <Link
            href="/my-plan?tab=plan"
            className="status-pill plan"
            title="Open Today's Plan"
          >
            <span>Plan</span>
            <strong>{plan.length}</strong>
          </Link>

          {/* SAVED */}
          <Link
            href="/my-plan?tab=saved"
            className="status-pill saved"
            title="Open Saved Workouts"
          >
            <Star size={11} />
            <span>Saved</span>
            <strong>{saved.length}</strong>
          </Link>
        </div>
      </div>
    </header>
  );
}