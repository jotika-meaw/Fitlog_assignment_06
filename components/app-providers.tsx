"use client";

import { Toaster } from "sonner";
import { WorkoutProvider } from "./workout-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WorkoutProvider>
      {children}
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </WorkoutProvider>
  );
}
