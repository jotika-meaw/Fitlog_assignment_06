import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell min-h-screen">
      <div className="not-found">
        <div className="logo-mark"><Dumbbell size={22} /></div>
        <span className="eyebrow">404 / ROUTE NOT FOUND</span>
        <h1>THAT REP DOESN&apos;T EXIST.</h1>
        <p>The page you requested is outside the FitLog training floor.</p>
        <Link className="button button-primary" href="/">
          <ArrowLeft size={17} /> BACK TO WORKOUTS
        </Link>
      </div>
    </main>
  );
}
