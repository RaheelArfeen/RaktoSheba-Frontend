"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { completeProfile } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/cn";
import { donorProfileSchema, hospitalProfileSchema, type DonorProfileValues, type HospitalProfileValues } from "@/lib/validations";

function useSubmit(next?: string) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const submit = (values: DonorProfileValues | HospitalProfileValues) => {
    setError("");
    startTransition(async () => {
      const result = await completeProfile(values, next);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };
  return { error, pending, submit };
}

function DonorForm({ next }: { next?: string }) {
  const { error, pending, submit } = useSubmit(next);
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<DonorProfileValues>({ resolver: zodResolver(donorProfileSchema) });
  const bloodGroup = useWatch({ control, name: "bloodGroup" });

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="space-y-6">
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
      {error && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-blood">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Spinner className="text-cream" /> : <>Finish setup <Check /></>}
      </Button>
    </form>
  );
}

function HospitalForm({ next }: { next?: string }) {
  const { error, pending, submit } = useSubmit(next);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HospitalProfileValues>({ resolver: zodResolver(hospitalProfileSchema) });

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
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
      <p className="rounded-2xl bg-sand px-4 py-3 text-xs leading-5 text-sand-deep">New hospitals are verified by our team before their requests reach donors.</p>
      {error && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-semibold text-blood">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Spinner className="text-cream" /> : <>Finish setup <Check /></>}
      </Button>
    </form>
  );
}

export function OnboardingForm({ role, next }: { role: "DONOR" | "HOSPITAL"; next?: string }) {
  return role === "DONOR" ? <DonorForm next={next} /> : <HospitalForm next={next} />;
}
