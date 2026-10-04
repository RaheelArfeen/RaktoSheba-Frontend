"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Building2, Check, HandHeart } from "lucide-react";
import { toast } from "sonner";
import { register as registerAccount } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { GoogleButton } from "./google-button";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/cn";
import { registerFormSchema, registerSteps, type RegisterFormValues, type RegisterValues } from "@/lib/validations";

const stepTitles = ["How will you help?", "Sign up", "A little about you"];

export function RegisterForm({ initialRole }: { initialRole?: "DONOR" | "HOSPITAL" }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema), defaultValues: { role: initialRole }, mode: "onTouched" });
  const role = useWatch({ control, name: "role" });
  const bloodGroup = useWatch({ control, name: "bloodGroup" });
  const last = registerSteps.length - 1;

  const next = async () => {
    if (await trigger(registerSteps[step])) setStep((s) => s + 1);
  };

  const onSubmit = (v: RegisterFormValues) => {
    const values: RegisterValues =
      v.role === "DONOR"
        ? { role: "DONOR", email: v.email, password: v.password, bloodGroup: v.bloodGroup! }
        : { role: "HOSPITAL", email: v.email, password: v.password, hospitalName: v.hospitalName!, hospitalAddress: v.hospitalAddress! };
    setError("");
    startTransition(async () => {
      const result = await registerAccount(values);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        // An "already exists" email error belongs to step 2.
        if (/email|exists/i.test(result.error)) setStep(1);
      }
    });
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        // Only the last step may submit; Enter on earlier steps just moves forward.
        if (step < last) {
          e.preventDefault();
          void next();
          return;
        }
        void handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2" aria-hidden>
          {registerSteps.map((_, i) => (
            <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-blood" : "bg-linen")} />
          ))}
        </div>
        <p className="mt-3 flex justify-between text-[10px] font-extrabold tracking-[.14em] text-ink-faint uppercase">
          <span>{stepTitles[step]}</span>
          <span>
            Step {step + 1} of {registerSteps.length}
          </span>
        </p>
      </div>

      {step === 0 && (
        <fieldset>
          <legend className="sr-only">Choose your role</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { value: "DONOR" as const, icon: HandHeart, title: "I'm a donor", text: "I can give blood when someone nearby needs it.", on: "border-forest/30 bg-mint", iconTone: "bg-mint-strong text-forest" },
              { value: "HOSPITAL" as const, icon: Building2, title: "I'm a hospital", text: "I need to post verified blood requests.", on: "border-blood/30 bg-blush", iconTone: "bg-blush-deep text-blood" },
            ].map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={role === o.value}
                onClick={() => setValue("role", o.value, { shouldValidate: true })}
                className={cn("relative rounded-[22px] border p-5 text-left transition-all", role === o.value ? o.on : "border-ink/10 bg-cream hover:border-blood/20")}
              >
                {role === o.value && (
                  <span className="absolute top-4 right-4 grid size-6 place-items-center rounded-full bg-ink text-cream">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
                <span className={cn("grid size-11 place-items-center rounded-2xl", o.iconTone)}>
                  <o.icon size={20} />
                </span>
                <span className="mt-5 block font-extrabold">{o.title}</span>
                <span className="mt-1 block text-sm leading-6 text-ink-muted">{o.text}</span>
              </button>
            ))}
          </div>
          <FieldError message={errors.role?.message} />
        </fieldset>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" autoComplete="new-password" placeholder="At least 6 characters" aria-invalid={!!errors.password} {...register("password")} />
              <FieldError message={errors.password?.message} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <PasswordInput id="confirmPassword" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
              <FieldError message={errors.confirmPassword?.message} />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1 text-xs font-bold tracking-[.14em] text-ink-faint uppercase">
            <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
          </div>
          {/* Google creates the account with the role picked in step 1, then asks for the profile details. */}
          <GoogleButton role={role} label={role === "HOSPITAL" ? "Sign up as a hospital with Google" : "Sign up as a donor with Google"} />
        </div>
      )}

      {step === 2 && role === "DONOR" && (
        <fieldset>
          <legend className="text-sm font-bold">Your blood group</legend>
          <p className="mt-1 text-sm text-ink-muted">We only show you requests your blood can safely help.</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={bloodGroup === g}
                onClick={() => setValue("bloodGroup", g, { shouldValidate: true })}
                className={cn(
                  "rounded-2xl border py-4 text-base font-extrabold transition-all",
                  bloodGroup === g ? "border-blood/30 bg-blush text-blood shadow-sm" : "border-ink/10 bg-paper text-ink-muted hover:border-blood/25",
                )}
              >
                {bloodGroupLabel[g]}
              </button>
            ))}
          </div>
          <FieldError message={errors.bloodGroup?.message} />
        </fieldset>
      )}

      {step === 2 && role === "HOSPITAL" && (
        <div className="space-y-5">
          <div>
            <Label htmlFor="hospitalName">Hospital name</Label>
            <Input id="hospitalName" placeholder="e.g. Dhaka Medical College Hospital" aria-invalid={!!errors.hospitalName} {...register("hospitalName")} />
            <FieldError message={errors.hospitalName?.message} />
          </div>
          <div>
            <Label htmlFor="hospitalAddress">Address</Label>
            <Input id="hospitalAddress" placeholder="Street, area, city" aria-invalid={!!errors.hospitalAddress} {...register("hospitalAddress")} />
            <FieldError message={errors.hospitalAddress?.message} />
          </div>
          <p className="rounded-2xl bg-sand px-4 py-3 text-xs leading-5 text-sand-deep">
            New hospitals are verified by our team before their requests reach donors.
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-blood">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} disabled={pending}>
            <ArrowLeft /> Back
          </Button>
        )}
        {step < last ? (
          <Button key="continue" type="button" className="flex-1" onClick={next}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button key="submit" type="submit" className="flex-1" disabled={pending}>
            {pending ? <Spinner className="text-cream" /> : <>Create my account <Check /></>}
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-bold text-blood hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
