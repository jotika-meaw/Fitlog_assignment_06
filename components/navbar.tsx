"use client";

import Link from "next/link";
import { Dumbbell, ListChecks } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWorkouts } from "./workout-provider";

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = useWorkouts();
  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="logo-mark"><Dumbbell size={18} strokeWidth={3}/></span>
          <span>FITLOG</span>
        </Link>
        <nav className="nav-links">
          <Link className={`nav-link ${pathname === "/" ? "active" : ""}`} href="/">WORKOUT</Link>
          <Link className={`nav-link ${pathname === "/my-plan" ? "active" : ""}`} href="/my-plan">MY PLAN</Link>
        </nav>
        <div className="nav-status">
          <Link href="/my-plan" className="status-pill plan"><ListChecks size={13}/>{plan.length} PLAN</Link>
          <Link href="/my-plan" className="status-pill saved">★ {saved.length} SAVED</Link>
        </div>
      </div>
    </header>
  );
}
