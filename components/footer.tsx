import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand"><span className="footer-mark"><Dumbbell size={14}/></span> FITLOG</div>
        <div>© 2026 FitLog — Workout Library. Train hard, log honest.</div>
      </div>
    </footer>
  );
}
