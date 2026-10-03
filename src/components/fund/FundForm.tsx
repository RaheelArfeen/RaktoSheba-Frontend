"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { FUND_PRESETS, fundSchema, type FundInput, type FundValues } from "@/lib/schemas/fund";
import { cn } from "@/lib/utils";

const purposes = [
  { value: "EMERGENCY_FUND" as const, title: "Emergency fund", text: "Donor transport and urgent coordination costs." },
  { value: "PLATFORM_DONATION" as const, title: "Keep RaktoSheba running", text: "Servers, SMS alerts and verification work." },
];

export default function FundForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FundInput, unknown, FundValues>({
    resolver: zodResolver(fundSchema),
    defaultValues: { amount: 10, purpose: "EMERGENCY_FUND" },
  });
  const amount = Number(useWatch({ control, name: "amount" }));
  const purpose = useWatch({ control, name: "purpose" });

  // Payments need a signed-in account, so the choice travels with the visitor to sign-in.
  const onSubmit = (values: FundValues) => {
    const next = `/fund?amount=${values.amount}&purpose=${values.purpose}`;
    router.push(`/login?next=${encodeURIComponent(next)}`);
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
        <Label htmlFor="amount" className="mt-4 block text-sm font-bold text-ink-muted">
          Or enter another amount (USD)
        </Label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-bold text-ink-faint">$</span>
          <Input id="amount" type="number" inputMode="decimal" step="0.01" min={1} aria-invalid={!!errors.amount} className="bg-paper pl-8" {...register("amount")} />
        </div>
        {errors.amount && <p className="mt-1.5 text-xs font-semibold text-blood">{errors.amount.message}</p>}
      </fieldset>

      <fieldset>
        <legend className="font-extrabold">Where should it go?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {purposes.map((p) => (
            <label
              key={p.value}
              className={cn(
                "cursor-pointer rounded-2xl border p-4 transition-colors",
                purpose === p.value ? "border-blood/30 bg-blush" : "border-ink/10 bg-paper hover:border-blood/20",
              )}
            >
              <input type="radio" value={p.value} className="sr-only" {...register("purpose")} />
              <span className={cn("block text-sm font-extrabold", purpose === p.value && "text-blood")}>{p.title}</span>
              <span className="mt-1 block text-xs leading-5 text-ink-muted">{p.text}</span>
            </label>
          ))}
        </div>
        {errors.purpose && <p className="mt-1.5 text-xs font-semibold text-blood">{errors.purpose.message}</p>}
      </fieldset>

      <Button type="submit" size="lg" className="w-full">
        Contribute {Number.isFinite(amount) && amount >= 1 ? formatCurrency(amount) : ""} <ArrowRight />
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-faint">
        <Lock size={12} /> Secure payment by Stripe. You&apos;ll sign in first so we can send your receipt.
      </p>
    </form>
  );
}
