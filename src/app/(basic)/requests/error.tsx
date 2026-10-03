"use client";

import { ErrorState } from "@/components/ui/error-state";
import { contact } from "@/lib/site";

export default function RequestsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="The request board is unavailable"
      message={`We couldn't load live requests right now. If this is an emergency, call ${contact.emergencyLine}.`}
      reset={reset}
    />
  );
}
