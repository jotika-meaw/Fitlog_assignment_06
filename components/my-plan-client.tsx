"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Flame,
  X,
} from "lucide-react";

import { toast } from "sonner";
import { useMemo, useState } from "react";

import Navbar from "./navbar";
import Footer from "./footer";
import { useWorkouts } from "./workout-provider";

import type { Workout, PlanItem } from "@/lib/types";

function imageFor(workout: Workout | PlanItem) {
  if (workout.image) {
    return workout.image;
  }

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="700"
      height="460"
    >
      <rect
        width="100%"
        height="100%"
        fill="#151a15"
      />
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#caff00"
        font-family="Arial"
        font-size="30"
        font-weight="900"
      >
        ${workout.name.slice(0, 20)}
      </text>
    </svg>
  `)}`;
}

function PlanCard({
  workout,
  onRemove,
  onDone,
  savedTab,
}: {
  workout: PlanItem | Workout;
  onRemove: () => void;
  onDone?: () => void;
  savedTab: boolean;
}) {
  const done =
    "done" in workout ? Boolean(workout.done) : false;

  return (
    <article className="plan-card">
      <div className="plan-thumb">
        <img
          src={imageFor(workout)}
          alt={workout.name}
        />
      </div>

      <div className="plan-info">
        <h3>{workout.name}</h3>

        <p>{workout.equipment}</p>

        <div
          className="stats"
          style={{
            paddingTop: 9,
            marginTop: 9,
            borderTop: 0,
          }}
        >
          <span className="stat">
            <Clock3 size={12} />
            {workout.duration} min
          </span>

          <span className="stat">
            <Flame size={12} />
            {workout.calories} kcal
          </span>

          <span className="stat">
            ★ {workout.rating}
          </span>
        </div>

        {done && (
          <div className="done-badge">
            <Check
              size={12}
              style={{
                verticalAlign: "middle",
              }}
            />{" "}
            DONE
          </div>
        )}
      </div>

      <div className="plan-actions">
        <Link
          href={`/workout/${workout.id}`}
          className="button button-secondary"
        >
          <ExternalLink size={14} />
          VIEW DETAILS
        </Link>

        {!savedTab && onDone && (
          <button
            type="button"
            className="button button-primary"
            onClick={onDone}
            disabled={done}
          >
            <Check size={14} />
            {done ? "DONE" : "MARK AS DONE"}
          </button>
        )}

        <button
          type="button"
          className="icon-button"
          title={
            savedTab
              ? "Remove saved workout"
              : "Remove from today's plan"
          }
          aria-label={
            savedTab
              ? `Remove ${workout.name} from saved`
              : `Remove ${workout.name} from today's plan`
          }
          onClick={onRemove}
        >
          <X size={16} />
        </button>
      </div>
    </article>
  );
}

export default function MyPlanClient() {
  const {
    plan,
    saved,
    removeFromPlan,
    removeSaved,
    markDone,
  } = useWorkouts();

  const searchParams = useSearchParams();

  /*
   * URL controls which tab is opened:
   *
   * /my-plan?tab=plan
   * /my-plan?tab=saved
   */
  const initialTab =
    searchParams.get("tab") === "saved"
      ? "saved"
      : "plan";

  const [tab, setTab] = useState<
    "plan" | "saved"
  >(initialTab);

  const [sort, setSort] = useState<
    "duration" | "calories" | "rating"
  >("duration");

  /*
   * These metrics always describe Today's Plan,
   * not the Saved list.
   */
  const minutes = plan.reduce(
    (sum, workout) => sum + workout.duration,
    0
  );

  const calories = plan.reduce(
    (sum, workout) => sum + workout.calories,
    0
  );

  /*
   * Select the correct independent list.
   */
  const list = useMemo(() => {
    const currentList =
      tab === "plan" ? plan : saved;

    return [...currentList].sort(
      (a, b) =>
        Number(a[sort]) - Number(b[sort])
    );
  }, [tab, plan, saved, sort]);

  /*
   * Change tab AND update the URL.
   */
  const changeTab = (
    nextTab: "plan" | "saved"
  ) => {
    setTab(nextTab);

    window.history.replaceState(
      null,
      "",
      `/my-plan?tab=${nextTab}`
    );
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="plan-page">
        <div className="container">
          {/* PAGE HEADER */}
          <div className="page-title">
            <span className="eyebrow">
              TRAINING LOG
            </span>

            <h1 className="display">
              MY PLAN
            </h1>

            <p className="section-sub">
              Cap of five lifts for today. Finish
              them, then load more.
            </p>
          </div>

          {/* TODAY'S PLAN METRICS */}
          <div className="metrics">
            <div className="metric">
              <span className="metric-label">
                EXERCISES
              </span>

              <span className="metric-value">
                {plan.length}
              </span>
            </div>

            <div className="metric">
              <span className="metric-label">
                MINUTES
              </span>

              <span className="metric-value">
                {minutes}
              </span>
            </div>

            <div className="metric">
              <span className="metric-label">
                CALORIES
              </span>

              <span className="metric-value">
                {calories}
              </span>
            </div>
          </div>

          {/* TABS + SORT */}
          <div className="plan-toolbar">
            <div className="tabs">
              <button
                type="button"
                className={`tab ${
                  tab === "plan"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  changeTab("plan")
                }
              >
                TODAY&apos;S PLAN ({plan.length})
              </button>

              <button
                type="button"
                className={`tab ${
                  tab === "saved"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  changeTab("saved")
                }
              >
                SAVED ({saved.length})
              </button>
            </div>

            <label className="plan-sort">
              <ChevronDown size={14} />

              <span>SORT BY</span>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as
                      | "duration"
                      | "calories"
                      | "rating"
                  )
                }
                aria-label="Sort workouts"
              >
                <option value="duration">
                  Duration
                </option>

                <option value="calories">
                  Calories
                </option>

                <option value="rating">
                  Rating
                </option>
              </select>
            </label>
          </div>

          {/* EMPTY STATE */}
          {list.length === 0 ? (
            <div className="empty-state">
              <div>
                <span className="eyebrow">
                  {tab === "plan"
                    ? "EMPTY PLAN"
                    : "EMPTY SAVED"}
                </span>

                <h2 className="display">
                  NOTHING HERE YET
                </h2>

                <p>
                  {tab === "plan"
                    ? "Browse the library and add a lift to get today's training moving."
                    : "Save workouts from the library to keep them here for later."}
                </p>

                <Link
                  href="/"
                  className="button button-primary"
                >
                  GO TO WORKOUTS
                </Link>
              </div>
            </div>
          ) : (
            /* WORKOUT LIST */
            <div className="plan-list">
              {list.map((workout) => (
                <PlanCard
                  key={workout.id}
                  workout={workout}
                  savedTab={tab === "saved"}
                  onRemove={() => {
                    if (tab === "plan") {
                      removeFromPlan(
                        workout.id
                      );

                      toast.success(
                        "Removed from today's plan"
                      );
                    } else {
                      removeSaved(
                        workout.id
                      );

                      toast.success(
                        "Removed from saved"
                      );
                    }
                  }}
                  onDone={
                    tab === "plan"
                      ? () => {
                          markDone(
                            workout.id
                          );

                          toast.success(
                            `${workout.name} marked as done`
                          );
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}