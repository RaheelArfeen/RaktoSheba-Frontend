"use client";

import { useState } from "react";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CalendarClock, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { DONATION_INTERVAL_DAYS } from "@/lib/blood";
import { addDays, daysUntil, formatDate } from "@/lib/format";
import { eligibilitySchema, type EligibilityInput, type EligibilityValues } from "@/lib/validations";

type Result = { kind: "eligible" } | { kind: "wait"; until: string; days: number } | { kind: "not-now"; reasons: string[] };

function assess(v: EligibilityValues): Result {
  const reasons: string[] = [];
  if (v.age < 18) reasons.push("Donors must be at least 18 years old.");
  if (v.age > 60) reasons.push("Donors over 60 should check with a doctor before donating.");
  if (v.weight < 50) reasons.push("Donors must weigh at least 50 kg.");
  if (v.feelsWell === "no") reasons.push("Wait until you're feeling completely well.");
  if (v.recentIllness === "yes") reasons.push("Wait two weeks after a fever, cold or infection has cleared.");
  if (v.onAntibiotics === "yes") reasons.push("Wait until you've finished your course of antibiotics.");
  if (reasons.length) return { kind: "not-now", reasons };

  if (v.donatedBefore === "yes" && v.lastDonation) {
    const until = addDays(new Date(v.lastDonation).toISOString(), DONATION_INTERVAL_DAYS);
    const days = daysUntil(until);
    if (days > 0) return { kind: "wait", until, days };
  }
  return { kind: "eligible" };
}

function YesNo({ name, label, register, error }: { name: keyof EligibilityInput; label: string; register: UseFormRegister<EligibilityInput>; error?: string }) {
  return (
    <fieldset>
      <legend className="text-sm font-bold">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(["yes", "no"] as const).map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center justify-center rounded-xl border border-ink/12 bg-paper py-2.5 text-sm font-bold text-ink-muted transition-colors has-checked:border-blood/30 has-checked:bg-blush has-checked:text-blood"
          >
            <input type="radio" value={option} className="sr-only" {...register(name)} />
            {option === "yes" ? "Yes" : "No"}
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

/** "Can I donate?" quiz. Uses the same 90-day rule the backend enforces. */
export function EligibilityChecker() {
  const [result, setResult] = useState<Result | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EligibilityInput, unknown, EligibilityValues>({ resolver: zodResolver(eligibilitySchema) });
  const donatedBefore = useWatch({ control, name: "donatedBefore" });

  if (result) {
    return (
      <div className="rounded-[28px] border border-ink/10 bg-cream p-6 sm:p-8" aria-live="polite">
        {result.kind === "eligible" && (
          <>
            <CheckCircle2 className="size-10 text-forest" />
            <h3 className="mt-4 font-display text-4xl tracking-[-.015em] text-forest-deep">You can likely donate today.</h3>
            <p className="mt-3 leading-7 text-ink-muted">Based on your answers you meet the basic requirements. A short health check at the hospital confirms it on the day.</p>
            <ButtonLink href="/auth/register?role=donor" variant="forest" className="mt-6">
              Create your donor profile <ArrowRight />
            </ButtonLink>
          </>
        )}
        {result.kind === "wait" && (
          <>
            <CalendarClock className="size-10 text-sand-deep" />
            <h3 className="mt-4 font-display text-4xl tracking-[-.015em]">
              Almost—{result.days} day{result.days === 1 ? "" : "s"} to go.
            </h3>
            <p className="mt-3 leading-7 text-ink-muted">
              Donors wait {DONATION_INTERVAL_DAYS} days between donations so the body can rebuild its blood supply. You can donate again from{" "}
              <strong className="text-ink">{formatDate(result.until)}</strong>.
            </p>
            <ButtonLink href="/auth/register?role=donor" className="mt-6">
              Register now, we&apos;ll track it for you <ArrowRight />
            </ButtonLink>
          </>
        )}
        {result.kind === "not-now" && (
          <>
            <XCircle className="size-10 text-blood" />
            <h3 className="mt-4 font-display text-4xl tracking-[-.015em]">Not right now—and that&apos;s okay.</h3>
            <ul className="mt-4 space-y-2">
              {result.reasons.map((reason) => (
                <li key={reason} className="flex gap-2 text-sm leading-6 text-ink-muted">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blood" />
                  {reason}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-ink-muted">You can still help by sharing urgent requests with friends.</p>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setResult(null);
            reset();
          }}
          className="mt-6 flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-blood"
        >
          <RotateCcw size={14} /> Check again
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit((values) => setResult(assess(values)))} className="space-y-5 rounded-[28px] border border-ink/10 bg-cream p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" inputMode="numeric" placeholder="e.g. 26" aria-invalid={!!errors.age} {...register("age")} />
          <FieldError message={errors.age?.message} />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" type="number" inputMode="decimal" placeholder="e.g. 62" aria-invalid={!!errors.weight} {...register("weight")} />
          <FieldError message={errors.weight?.message} />
        </div>
      </div>
      <YesNo name="donatedBefore" label="Have you donated blood before?" register={register} error={errors.donatedBefore?.message} />
      <div className={donatedBefore === "yes" ? "block" : "hidden"}>
        <Label htmlFor="lastDonation">When was your last donation?</Label>
        <Input id="lastDonation" type="date" max={new Date().toISOString().slice(0, 10)} aria-invalid={!!errors.lastDonation} {...register("lastDonation")} />
        <FieldError message={errors.lastDonation?.message} />
      </div>
      <YesNo name="feelsWell" label="Are you feeling healthy today?" register={register} error={errors.feelsWell?.message} />
      <YesNo name="recentIllness" label="Fever, cold or infection in the last 2 weeks?" register={register} error={errors.recentIllness?.message} />
      <YesNo name="onAntibiotics" label="Are you currently taking antibiotics?" register={register} error={errors.onAntibiotics?.message} />
      <Button type="submit" size="lg" className="w-full">
        Check my eligibility <ArrowRight />
      </Button>
      <p className="text-center text-xs text-ink-faint">A guide only—the hospital confirms eligibility before you donate.</p>
    </form>
  );
}
