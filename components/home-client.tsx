"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "./navbar";
import Footer from "./footer";
import WorkoutCard from "./workout-card";
import { useWorkouts } from "./workout-provider";

export default function HomeClient() {
  const {
    workouts,
    loading,
    apiError,
    plan,
    saved,
  } = useWorkouts();

  const [sort, setSort] = useState("duration");
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = workouts.filter((workout) => {
      if (!query) return true;

      return (
        workout.name.toLowerCase().includes(query) ||
        workout.categories.some((category) =>
          category.toLowerCase().includes(query)
        )
      );
    });

    return [...filtered].sort(
      (a, b) => Number(a[sort]) - Number(b[sort])
    );
  }, [workouts, sort, search]);

  return (
    <main className="page-shell">
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">WORKOUT LIBRARY</span>

            <h1 className="display">
              TRAIN WITH INTENT.
              <br />
              LOG EVERY SET.
            </h1>

            <p className="hero-copy">
              FitLog is a dark, no-nonsense gym companion: pick a
              lift, lock it into today&apos;s plan, and watch the
              week&apos;s work add up.
            </p>

            <div className="hero-actions">
              <a
                href="#library"
                className="button button-primary"
              >
                BROWSE WORKOUTS
                <ArrowDown size={16} />
              </a>

              <a
                href="/my-plan"
                className="button button-secondary"
              >
                OPEN MY PLAN
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-art">
            <img
              src={workouts[0]?.image || "/hero.svg"}
              alt="FitLog training visual"
            />

            <div className="hero-overlay" />

            {/* Compact Plan / Saved Counters */}
            <div className="hero-status">
              <span>Plan</span>

              <strong className="hero-count plan-count">
                {plan.length}
              </strong>

              <span>Saved</span>

              <strong className="hero-count saved-count">
                {saved.length}
              </strong>
            </div>

            <div className="hero-badge">
              <strong>12 LIFTS / FULL BODY</strong>
              <span>Choose. Train. Log.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LIBRARY ==================== */}
      <section id="library" className="section">
        <div className="container">

          {/* Library Heading */}
          <div className="section-head">
            <div>
              <span className="eyebrow">THE LIBRARY</span>

              <h2 className="display">THE LIBRARY</h2>

              <p className="section-sub">
                Twelve lifts covering every major muscle group.
              </p>
            </div>
          </div>

          {/* ==================== SEARCH + SORT TOOLBAR ==================== */}
          <div className="library-toolbar">

            {/* Search */}
            <div className="library-search">
              <Search size={15} />

              <input
                type="text"
                aria-label="Search workouts"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search workout or tag"
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort */}
            <label className="library-sort">
              <SlidersHorizontal size={15} />

              <span>SORT BY</span>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                aria-label="Sort workouts"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
            </label>
          </div>

          {/* Search result information */}
          {!loading && (
            <div className="library-result-info">
              <span>
                {list.length}{" "}
                {list.length === 1 ? "workout" : "workouts"}
              </span>

              {search && (
                <span>
                  Results for &quot;{search}&quot;
                </span>
              )}
            </div>
          )}

          {/* ==================== LOADING ==================== */}
          {loading ? (
            <div className="inline-loading">
              <div>
                <div
                  className="loader-ring"
                  style={{
                    margin: "0 auto 12px",
                  }}
                />

                <p
                  className="muted"
                  style={{
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  LOADING WORKOUTS…
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* API fallback message */}
              {apiError && (
                <div className="api-message">
                  Live API is temporarily unavailable. Showing
                  the built-in workout library so the app remains
                  usable.
                </div>
              )}

              {/* Workout Grid */}
              {list.length > 0 ? (
                <div className="workout-grid">
                  {list.map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div>
                    <span className="eyebrow">
                      NO RESULTS
                    </span>

                    <h2 className="display">
                      NOTHING FOUND
                    </h2>

                    <p>
                      Try another workout name or muscle-group
                      tag.
                    </p>

                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setSearch("")}
                    >
                      CLEAR SEARCH
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}