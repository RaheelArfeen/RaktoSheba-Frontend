"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Clock3,
  LocateFixed,
  MapPin,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBloodRequest } from "@/app/actions/hospital";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/cn";
import {
  bloodRequestWizardSchema,
  requestWizardSteps,
  type BloodRequestWizardInput,
  type BloodRequestWizardValues,
} from "@/lib/validations";

const STEP_TITLES = ["Blood group needed", "Urgency & units", "Location", "Review & post"];

const URGENCY_OPTIONS = [
  {
    value: 5,
    icon: CircleAlert,
    title: "Critical",
    text: "Life-threatening — blood needed right now.",
    on: "border-blood/30 bg-blush",
    iconTone: "bg-blood text-white",
    titleTone: "text-blood",
  },
  {
    value: 4,
    icon: Zap,
    title: "Severe",
    text: "Needed within hours — surgery or heavy blood loss.",
    on: "border-blood/20 bg-blush/60",
    iconTone: "bg-blush-deep text-blood",
    titleTone: "text-blood",
  },
  {
    value: 3,
    icon: Clock3,
    title: "Urgent",
    text: "Needed today for a planned procedure or treatment.",
    on: "border-sand-deep/30 bg-sand",
    iconTone: "bg-gold text-sand-deep",
    titleTone: "text-sand-deep",
  },
  {
    value: 1,
    icon: MapPin,
    title: "Standard",
    text: "Needed soon; time is available to find the right donor.",
    on: "border-ink/20 bg-linen",
    iconTone: "bg-linen-deep text-ink-soft",
    titleTone: "text-ink-soft",
  },
] as const;

export function NewRequestWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [locating, setLocating] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = useForm<BloodRequestWizardInput, unknown, BloodRequestWizardValues>({
    resolver: zodResolver(bloodRequestWizardSchema),
    defaultValues: { units: 2, urgency: 3 },
  });

  const bloodGroup = useWatch({ control, name: "bloodGroup" });
  const urgency = useWatch({ control, name: "urgency" });
  const units = useWatch({ control, name: "units" });
  const location = useWatch({ control, name: "location" });
  const lat = useWatch({ control, name: "lat" });

  const last = requestWizardSteps.length - 1;

  const next = async () => {
    const fields = requestWizardSteps[step];
    if (fields.length === 0 || (await trigger(fields as (keyof BloodRequestWizardInput)[]))) {
      setStep((s) => s + 1);
    }
  };

  const locate = () => {
    if (!navigator.geolocation) return toast.error("Your browser can't share your location.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setValue("lat", Math.round(coords.latitude * 1000) / 1000, { shouldDirty: true });
        setValue("lng", Math.round(coords.longitude * 1000) / 1000, { shouldDirty: true });
        setLocating(false);
        toast.success("Location added to the request.");
      },
      () => {
        setLocating(false);
        toast.error("We couldn't get your location. Check that location access is allowed.");
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  };

  const urgencyOption = URGENCY_OPTIONS.find((o) => o.value === Number(urgency));
  const urgencyLabel = urgencyOption?.title ?? "Unknown";

  const onSubmit = (values: BloodRequestWizardValues) => {
    startTransition(async () => {
      const result = await createBloodRequest(values);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        router.push("/dashboard/hospital/requests/" + result.id);
      }
    });
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        if (step < last) {
          e.preventDefault();
          void next();
          return;
        }
        void handleSubmit(onSubmit)(e);
      }}
      className="rounded-[28px] border border-ink/10 bg-cream p-6 sm:p-8"
    >
      {/* Progress bar */}
      <div className="flex items-center gap-2" aria-hidden>
        {requestWizardSteps.map((_, i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-blood" : "bg-linen")} />
        ))}
      </div>
      <p className="mt-3 flex justify-between text-[10px] font-extrabold tracking-[.14em] text-ink-faint uppercase">
        <span>{STEP_TITLES[step]}</span>
        <span>
          Step {step + 1} of {requestWizardSteps.length}
        </span>
      </p>

      {/* Step 0 — Blood group */}
      {step === 0 && (
        <fieldset className="mt-5">
          <legend className="font-extrabold">Which blood group is needed?</legend>
          <p className="mt-1 text-sm text-ink-muted">
            Select the blood group required for this request.
          </p>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={bloodGroup === g}
                onClick={() => setValue("bloodGroup", g, { shouldValidate: true })}
                className={cn(
                  "rounded-2xl border py-4 text-base font-extrabold transition-all",
                  bloodGroup === g
                    ? "border-blood/30 bg-blush text-blood shadow-sm"
                    : "border-ink/10 bg-paper text-ink-muted hover:border-blood/25",
                )}
              >
                {bloodGroupLabel[g]}
              </button>
            ))}
          </div>
          <FieldError message={errors.bloodGroup?.message} />
        </fieldset>
      )}

      {/* Step 1 — Urgency & units */}
      {step === 1 && (
        <div className="mt-5 space-y-5">
          <fieldset>
            <legend className="font-extrabold">How urgent is this request?</legend>
            <div className="mt-4 grid gap-2">
              {URGENCY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={Number(urgency) === o.value}
                  onClick={() => setValue("urgency", o.value, { shouldValidate: true })}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                    Number(urgency) === o.value ? o.on : "border-ink/10 bg-paper",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl",
                      o.iconTone,
                    )}
                  >
                    <o.icon size={18} />
                  </span>
                  <span>
                    <span className={cn("block text-sm font-extrabold", o.titleTone)}>
                      {o.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{o.text}</span>
                  </span>
                </button>
              ))}
            </div>
            <FieldError message={errors.urgency?.message} />
          </fieldset>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="units" className="mb-0">
                Units needed
              </Label>
              <span className="font-display text-xl text-blood">{String(units ?? "")}</span>
            </div>
            <input
              id="units"
              type="range"
              min={1}
              max={10}
              className="mt-2 w-full accent-blood"
              {...register("units")}
            />
            <FieldError message={errors.units?.message} />
          </div>
        </div>
      )}

      {/* Step 2 — Location */}
      {step === 2 && (
        <div className="mt-5 space-y-5">
          <div>
            <Label htmlFor="location">Hospital or area</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-blood" />
              <Input
                id="location"
                autoFocus
                placeholder="e.g. Dhaka Medical College Hospital, Bakshi Bazar"
                aria-invalid={!!errors.location}
                className="pl-11"
                {...register("location")}
              />
            </div>
            <FieldError message={errors.location?.message} />
          </div>

          <div>
            <p className="text-sm font-bold">Coordinates (optional)</p>
            <p className="mt-1 text-sm text-ink-muted">
              Helps donors see the distance. We never share exact coordinates publicly.
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="button" variant="outline" onClick={locate} disabled={locating}>
                {locating ? <Spinner /> : <LocateFixed />}{" "}
                {lat != null ? "Update location" : "Use my current location"}
              </Button>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
                <MapPin size={15} className={lat != null ? "text-forest" : "text-ink-faint"} />
                {lat != null ? "Location added" : "No location yet"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-ink-muted">
            Review the details before posting. Donors will be alerted after admin verification.
          </p>
          <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-paper">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-semibold text-ink-muted">Blood group</span>
              <span className="font-extrabold text-blood">
                {bloodGroup ? bloodGroupLabel[bloodGroup] : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-semibold text-ink-muted">Urgency</span>
              <span className="font-extrabold">{urgencyLabel}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-semibold text-ink-muted">Units needed</span>
              <span className="font-extrabold">{String(units ?? "—")}</span>
            </div>
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <span className="text-sm font-semibold text-ink-muted">Location</span>
              <span className="max-w-[60%] text-right font-semibold">{location || "—"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-7 flex gap-2">
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={pending}
          >
            <ArrowLeft /> Back
          </Button>
        )}
        {step < last ? (
          <Button key="continue" type="button" className="flex-1" onClick={next}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button key="submit" type="submit" className="flex-1" disabled={pending}>
            {pending ? <Spinner className="text-cream" /> : <><Check /> Post request</>}
          </Button>
        )}
      </div>
    </form>
  );
}
