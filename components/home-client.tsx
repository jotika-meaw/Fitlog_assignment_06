"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Search,
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

  const [search, setSearch] = useState("");

  /* =========================================
     SEARCH / FILTER WORKOUTS
     ========================================= */

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return workouts;
    }

    return workouts.filter((workout) => {
      const nameMatch = workout.name
        .toLowerCase()
        .includes(query);

      const categoryMatch = workout.categories.some(
        (category) =>
          category.toLowerCase().includes(query)
      );

      return nameMatch || categoryMatch;
    });
  }, [workouts, search]);

  return (
    <main className="page-shell">
      <Navbar />

      {/* =========================================
          HERO
          ========================================= */}
<section className="hero">
  <div className="container">
    <div className="hero-card">
      <div className="hero-content">
        <span className="eyebrow">
          WORKOUT LIBRARY
        </span>

        <h1 className="display hero-title">
          TRAIN WITH INTENT.
          <br />
          LOG EVERY SET.
        </h1>

        <p className="hero-copy">
          FitLog is a dark, no-nonsense gym companion:
          pick a lift, lock it into today&apos;s plan,
          and watch the week&apos;s work add up.
        </p>

        <div className="hero-actions">
          <a
            href="#library"
            className="button button-primary"
          >
            BROWSE WORKOUTS
            <span className="hero-arrow">↓</span>
          </a>

          <a
            href="/my-plan?tab=plan"
            className="button button-secondary"
          >
            OPEN MY PLAN
            <span className="hero-arrow">→</span>
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <img
          src="/banner1.png"
          alt="FitLog workout illustration"
        />
      </div>
    </div>
  </div>
</section>

      {/* =========================================
          WORKOUT LIBRARY
          ========================================= */}

      <section
        id="library"
        className="section"
      >
        <div className="container">

          {/* Library Heading */}
          <div className="section-head">
            <div>
              <span className="eyebrow">
                THE LIBRARY
              </span>

              <h2 className="display">
                THE LIBRARY
              </h2>

              <p className="section-sub">
                Twelve lifts covering every major
                muscle group.
              </p>
            </div>
          </div>

          {/* =====================================
              SEARCH
              ===================================== */}

          <div className="library-toolbar">

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

          </div>

          {/* Search result information */}
          {!loading && (
            <div className="library-result-info">
              <span>
                {list.length}{" "}
                {list.length === 1
                  ? "WORKOUT"
                  : "WORKOUTS"}
              </span>

              {search && (
                <span>
                  RESULTS FOR &quot;{search}&quot;
                </span>
              )}
            </div>
          )}

          {/* =====================================
              LOADING
              ===================================== */}

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
              {/* =================================
                  API FALLBACK MESSAGE
                  ================================= */}

              {apiError && (
                <div className="api-message">
                  Live API is temporarily unavailable.
                  Showing the built-in workout library
                  so the app remains usable.
                </div>
              )}

              {/* =================================
                  WORKOUT GRID
                  ================================= */}

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
                /* ================================
                   NO SEARCH RESULTS
                   ================================ */

                <div className="empty-state">
                  <div>
                    <span className="eyebrow">
                      NO RESULTS
                    </span>

                    <h2 className="display">
                      NOTHING FOUND
                    </h2>

                    <p>
                      Try another workout name or
                      muscle-group tag.
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

      {/* =========================================
          FOOTER
          ========================================= */}

      <Footer />
    </main>
  );
}