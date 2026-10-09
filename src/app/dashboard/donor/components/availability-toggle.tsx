"use client";

import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { errorMessage } from "@/lib/client-api";
import { useSetAvailability } from "@/lib/queries/use-donor";

/**
 * On/off switch for match alerts. The mutation updates the cached profile
 * optimistically — `isAvailable` flips on the next render and rolls back if
 * the server rejects the change.
 */
export function AvailabilityToggle({ isAvailable }: { isAvailable: boolean }) {
  const setAvailability = useSetAvailability();

  const toggle = () => {
    const next = !isAvailable;
    setAvailability.mutate(next, {
      onSuccess: () =>
        toast.success(
          next ? "You're available. We'll show you requests you can help." : "You're taking a break. We won't send match alerts.",
        ),
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-ink/10 bg-cream p-5 sm:p-6">
      <div>
        <p id="availability-label" className="font-bold">
          {isAvailable ? "I'm available to donate" : "I'm taking a break"}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {isAvailable ? "Hospitals can match you with requests your blood can help." : "Turn this on when you're ready to help again."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isAvailable}
        aria-labelledby="availability-label"
        onClick={toggle}
        disabled={setAvailability.isPending}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-70",
          isAvailable ? "bg-forest" : "bg-ink/20",
        )}
      >
        <span className={cn("absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform", isAvailable && "translate-x-6")} />
      </button>
    </div>
  );
}
