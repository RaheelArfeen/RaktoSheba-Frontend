"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { setAvailability } from "@/app/actions/donor";
import { cn } from "@/lib/cn";

/** On/off switch for match alerts. Flips instantly and rolls back if the save fails. */
export function AvailabilityToggle({ isAvailable }: { isAvailable: boolean }) {
  const [pending, startTransition] = useTransition();
  const [on, setOn] = useOptimistic(isAvailable);

  const toggle = () =>
    startTransition(async () => {
      const next = !on;
      setOn(next);
      const result = await setAvailability(next);
      if ("error" in result) toast.error(result.error);
      else toast.success(next ? "You're available. We'll show you requests you can help." : "You're taking a break. We won't send match alerts.");
    });

  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-ink/10 bg-cream p-5 sm:p-6">
      <div>
        <p id="availability-label" className="font-bold">
          {on ? "I'm available to donate" : "I'm taking a break"}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {on ? "Hospitals can match you with requests your blood can help." : "Turn this on when you're ready to help again."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="availability-label"
        onClick={toggle}
        disabled={pending}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-70",
          on ? "bg-forest" : "bg-ink/20",
        )}
      >
        <span className={cn("absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform", on && "translate-x-6")} />
      </button>
    </div>
  );
}
