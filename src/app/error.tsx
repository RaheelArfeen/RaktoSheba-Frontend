"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

/**
 * Root error boundary. Catches anything an `error.tsx` closer to the page
 * didn't already handle. Error boundaries must be Client Components.
 */
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState title="Something broke on our end" message="This page ran into an unexpected error. Trying again usually fixes it." reset={reset} />;
}
