"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { startCheckout } from "@/app/actions/payments";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { FUND_PRESETS, fundSchema, type FundInput, type FundValues } from "@/lib/validations";

const purposes = [
  { value: "EMERGENCY_FUND" as const, title: "Emergency fund", text: "Donor transport and urgent coordination costs." },
  { value: "PLATFORM_DONATION" as const, title: "Keep RaktoSheba running", text: "Servers, SMS alerts and verification work." },
];

export function FundForm({ signedIn, defaults }: { signedIn: boolean; defaults?: Partial<FundValues> }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FundInput, unknown, FundValues>({ resolver: zodResolver(fundSchema), defaultValues: { amount: defaults?.amount ?? 10, purpose: defaults?.purpose ?? "EMERGENCY_FUND" } });
  const amount = Number(useWatch({ control, name: "amount" }));
  const purpose = useWatch({ control, name: "purpose" });

  // The action sends signed-out visitors to sign in (keeping their choice) and everyone else to Stripe.
  const onSubmit = (values: FundValues) => {
    setError("");
    startTransition(async () => {
      const result = await startCheckout(values);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-[28px] border border-ink/10 bg-cream p-6 sm:p-8">
      <fieldset>
        <legend className="font-extrabold">Choose an amount</legend>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {FUND_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={amount === preset}
              onClick={() => setValue("amount", preset, { shouldValidate: true })}
              className={cn(
                "rounded-2xl border py-4 font-display text-2xl transition-all",
                amount === preset ? "border-blood/30 bg-blood text-cream shadow-sm" : "border-ink/10 bg-paper text-ink-soft hover:border-blood/25",
              )}
            >
              ${preset}
            </button>
          ))}
        </div>
        <Label htmlFor="amount" className="mt-4 font-semibold text-ink-muted">
          Or enter another amount (USD)
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-bold text-ink-faint">$</span>
          <Input id="amount" type="number" inputMode="decimal" step="0.01" min={1} aria-invalid={!!errors.amount} className="pl-8" {...register("amount")} />
        </div>
        <FieldError message={errors.amount?.message} />
      </fieldset>

      <fieldset>
        <legend className="font-extrabold">Where should it go?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {purposes.map((p) => (
            <label
              key={p.value}
              className={cn("cursor-pointer rounded-2xl border p-4 transition-colors", purpose === p.value ? "border-blood/30 bg-blush" : "border-ink/10 bg-paper hover:border-blood/20")}
            >
              <input type="radio" value={p.value} className="sr-only" {...register("purpose")} />
              <span className={cn("block text-sm font-extrabold", purpose === p.value && "text-blood")}>{p.title}</span>
              <span className="mt-1 block text-xs leading-5 text-ink-muted">{p.text}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.purpose?.message} />
      </fieldset>

      {error && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-blood">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <Spinner className="text-cream" />
        ) : (
          <>
            {signedIn ? "Pay" : "Sign in to contribute"} {Number.isFinite(amount) && amount >= 1 ? formatCurrency(amount) : ""} <ArrowRight />
          </>
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-faint">
        <Lock size={12} /> Secure payment by Stripe (test mode).{" "}
        {signedIn ? "You'll be sent to Stripe to pay." : "You'll sign in first so we can send your receipt."}
      </p>
    </form>
  );
}
