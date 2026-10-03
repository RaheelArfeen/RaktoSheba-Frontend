"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Copy, MapPin, RotateCcw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { contact } from "@/lib/site";
import {
  emergencySteps,
  emergencySummarySchema,
  type EmergencySummary,
  type EmergencySummaryInput,
} from "@/lib/schemas/emergency";
import { cn } from "@/lib/utils";
import type { BloodGroup } from "@/types/api";

const summaryText = (s: EmergencySummary) =>
  [
    `URGENT BLOOD NEEDED — ${bloodGroupLabel[s.bloodGroup as BloodGroup]}`,
    `${s.units} unit${s.units === 1 ? "" : "s"} · ${s.urgency === "now" ? "needed right now" : "needed today"}`,
    `Location: ${s.location}`,
    s.patientName ? `Patient: ${s.patientName}` : null,
    `Emergency line: ${contact.emergencyLine}`,
  ]
    .filter(Boolean)
    .join("\n");

// Three short steps that turn a stressful moment into one clear message to share.
export default function EmergencySummaryWizard() {
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState<EmergencySummary | null>(null);
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<EmergencySummaryInput, unknown, EmergencySummary>({
    resolver: zodResolver(emergencySummarySchema),
    defaultValues: { units: 2, urgency: "now" },
  });
  const bloodGroup = useWatch({ control, name: "bloodGroup" });
  const units = useWatch({ control, name: "units" });
  const urgency = useWatch({ control, name: "urgency" });

  const next = async () => {
    if (await trigger(emergencySteps[step])) setStep((s) => s + 1);
  };

  const share = async () => {
    if (!summary) return;
    const text = summaryText(summary);
    try {
      if (navigator.share) await navigator.share({ title: "Urgent blood needed", text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success("Summary copied. Paste it into a message or call.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) toast.error("Couldn't share. Try copying instead.");
    }
  };

  const copy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summaryText(summary));
      toast.success("Summary copied.");
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  };

  if (summary) {
    return (
      <div className="rounded-[28px] bg-mint p-6 sm:p-8" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-mint-strong text-forest">
            <Check size={23} strokeWidth={3} />
          </span>
          <div>
            <p className="eyebrow text-forest">Summary ready</p>
            <p className="mt-1 font-display text-2xl text-forest-deep">Share it with the hospital or family</p>
          </div>
        </div>
        <pre className="mt-6 rounded-2xl bg-cream/80 p-4 font-sans text-sm leading-6 whitespace-pre-wrap text-ink">{summaryText(summary)}</pre>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" className="flex-1" onClick={share}>
            <Share2 /> Share summary
          </Button>
          <Button variant="outline" className="flex-1" onClick={copy}>
            <Copy /> Copy text
          </Button>
        </div>
        <button
          type="button"
          onClick={() => {
            setSummary(null);
            setStep(0);
            reset();
          }}
          className="mt-5 flex items-center gap-2 text-xs font-bold text-forest hover:underline"
        >
          <RotateCcw size={13} /> Start a new summary
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        // Only the last step may submit (e.g. pressing Enter in step 2 just moves on).
        if (step < emergencySteps.length - 1) {
          e.preventDefault();
          void next();
          return;
        }
        void handleSubmit((values) => setSummary(values))(e);
      }}
      className="rounded-[28px] border border-ink/10 bg-cream p-6 sm:p-8"
    >
      <div className="flex items-center gap-2" aria-hidden>
        {emergencySteps.map((_, i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-blood" : "bg-linen")} />
        ))}
      </div>
      <p className="mt-3 text-right text-[10px] font-extrabold tracking-[.14em] text-ink-faint uppercase">
        Step {step + 1} of {emergencySteps.length}
      </p>

      {step === 0 && (
        <fieldset className="mt-5">
          <legend className="font-extrabold">Which blood group is needed?</legend>
          <p className="mt-1 text-sm text-ink-muted">Choose the closest known match. The hospital confirms it.</p>
          <div className="mt-5 grid grid-cols-4 gap-2">
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
          {errors.bloodGroup && <p className="mt-2 text-xs font-semibold text-blood">{errors.bloodGroup.message}</p>}
        </fieldset>
      )}

      {step === 1 && (
        <div className="mt-5 space-y-5">
          <div>
            <Label htmlFor="location" className="font-extrabold">
              Where should help go?
            </Label>
            <div className="relative mt-2">
              <MapPin className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-blood" />
              <Input id="location" autoFocus placeholder="e.g. Square Hospital, Panthapath" aria-invalid={!!errors.location} className="bg-paper pl-11" {...register("location")} />
            </div>
            {errors.location && <p className="mt-1.5 text-xs font-semibold text-blood">{errors.location.message}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="units" className="font-extrabold">
                Units needed
              </Label>
              <span className="font-display text-2xl text-blood">{String(units ?? "")}</span>
            </div>
            <input id="units" type="range" min={1} max={10} className="mt-2 w-full accent-blood" {...register("units")} />
            {errors.units && <p className="mt-1.5 text-xs font-semibold text-blood">{errors.units.message}</p>}
          </div>
          <div>
            <Label htmlFor="patientName" className="font-extrabold">
              Patient name <span className="font-semibold text-ink-faint">(optional)</span>
            </Label>
            <Input id="patientName" placeholder="Helps the hospital find the right patient" className="mt-2 bg-paper" {...register("patientName")} />
            {errors.patientName && <p className="mt-1.5 text-xs font-semibold text-blood">{errors.patientName.message}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <fieldset className="mt-5">
          <legend className="font-extrabold">How soon is blood needed?</legend>
          <div className="mt-4 grid gap-2">
            {[
              { value: "now" as const, icon: CircleAlert, title: "Right now", text: "Active emergency or surgery in progress", on: "border-blood/30 bg-blush", iconTone: "bg-blood text-white", titleTone: "text-blood" },
              { value: "today" as const, icon: Clock3, title: "Later today", text: "A planned procedure or near-term need", on: "border-sand-deep/30 bg-sand", iconTone: "bg-gold text-sand-deep", titleTone: "text-sand-deep" },
            ].map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={urgency === o.value}
                onClick={() => setValue("urgency", o.value, { shouldValidate: true })}
                className={cn("flex items-center gap-4 rounded-2xl border p-4 text-left transition-all", urgency === o.value ? o.on : "border-ink/10 bg-paper")}
              >
                <span className={cn("grid size-10 place-items-center rounded-xl", o.iconTone)}>
                  <o.icon size={18} />
                </span>
                <span>
                  <span className={cn("block text-sm font-extrabold", o.titleTone)}>{o.title}</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">{o.text}</span>
                </span>
              </button>
            ))}
          </div>
          {errors.urgency && <p className="mt-2 text-xs font-semibold text-blood">{errors.urgency.message}</p>}
        </fieldset>
      )}

      <div className="mt-7 flex gap-2">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft /> Back
          </Button>
        )}
        {step < emergencySteps.length - 1 ? (
          // Distinct keys stop React reusing this element as the submit button mid-click.
          <Button key="continue" type="button" className="flex-1" onClick={next}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button key="submit" type="submit" className="flex-1">
            Create summary <Check />
          </Button>
        )}
      </div>
      <p className="mt-4 text-center text-[11px] leading-5 text-ink-faint">
        This prepares a message to share—it doesn&apos;t post a request. Only verified hospitals can post requests to donors.
      </p>
    </form>
  );
}
