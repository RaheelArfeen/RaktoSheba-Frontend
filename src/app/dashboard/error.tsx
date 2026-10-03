"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState title="Your workspace didn't load" message="We couldn't reach RaktoSheba just now. Try again in a moment." reset={reset} />;
}
