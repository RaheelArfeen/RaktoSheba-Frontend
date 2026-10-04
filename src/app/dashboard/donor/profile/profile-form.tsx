"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LocateFixed, MapPin } from "lucide-react";
import { toast } from "sonner";
import { updateDonorProfile } from "@/app/actions/donor";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/cn";
import { donorEditSchema, type DonorEditValues } from "@/lib/validations";
import type { DonorProfile } from "@/types";

const toDateInput = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }) : "");

export function ProfileForm({ profile }: { profile: DonorProfile }) {
  const [pending, startTransition] = useTransition();
  const [locating, setLocating] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<DonorEditValues>({
    resolver: zodResolver(donorEditSchema),
    defaultValues: {
      bloodGroup: profile.bloodGroup,
      lastDonationAt: toDateInput(profile.lastDonationAt),
      lat: profile.lat,
      lng: profile.lng,
    },
  });
  const bloodGroup = useWatch({ control, name: "bloodGroup" });
  const lat = useWatch({ control, name: "lat" });

  const locate = () => {
    if (!navigator.geolocation) return toast.error("Your browser can't share your location.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        // Rounded to about 100 m: close enough to sort hospitals by distance, without pinpointing a home.
        setValue("lat", Math.round(coords.latitude * 1000) / 1000, { shouldDirty: true });
        setValue("lng", Math.round(coords.longitude * 1000) / 1000, { shouldDirty: true });
        setLocating(false);
        toast.success("Location added. Save to keep it.");
      },
      () => {
        setLocating(false);
        toast.error("We couldn't get your location. Check that location access is allowed.");
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  };

  const onSubmit = (values: DonorEditValues) =>
    startTransition(async () => {
      const result = await updateDonorProfile(values);
      if ("error" in result) return void toast.error(result.error);
      toast.success("Profile saved.");
      reset(values);
    });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-7 rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-8">
      <fieldset>
        <legend className="text-sm font-bold">Blood group</legend>
        <p className="mt-1 text-sm text-ink-muted">Only change this if a blood test showed a different group.</p>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:max-w-md">
          {BLOOD_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={bloodGroup === g}
              onClick={() => setValue("bloodGroup", g, { shouldDirty: true, shouldValidate: true })}
              className={cn(
                "rounded-2xl border py-3 text-base font-extrabold transition-all",
                bloodGroup === g ? "border-blood/30 bg-blush text-blood shadow-sm" : "border-ink/10 bg-paper text-ink-muted hover:border-blood/25",
              )}
            >
              {bloodGroupLabel[g]}
            </button>
          ))}
        </div>
        <FieldError message={errors.bloodGroup?.message} />
      </fieldset>

      <div className="sm:max-w-xs">
        <Label htmlFor="lastDonationAt">When did you last give blood?</Label>
        <Input
          id="lastDonationAt"
          type="date"
          max={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" })}
          aria-invalid={!!errors.lastDonationAt}
          aria-describedby="lastDonationAt-hint"
          {...register("lastDonationAt")}
        />
        <p id="lastDonationAt-hint" className="mt-1.5 text-xs text-ink-faint">
          Leave empty if you&apos;ve never donated. We use it to work out when you can give again.
        </p>
        <FieldError message={errors.lastDonationAt?.message} />
      </div>

      <div>
        <p className="text-sm font-bold">Your location</p>
        <p className="mt-1 text-sm text-ink-muted">Used only to show how far each hospital is. Hospitals never see it.</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="outline" onClick={locate} disabled={locating}>
            {locating ? <Spinner /> : <LocateFixed />} {lat != null ? "Update my location" : "Use my current location"}
          </Button>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
            <MapPin size={15} className={lat != null ? "text-forest" : "text-ink-faint"} />
            {lat != null ? "Location added" : "No location yet"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-ink/10 pt-6">
        <Button type="submit" disabled={pending || !isDirty}>
          {pending ? <Spinner className="text-cream" /> : <><Check /> Save changes</>}
        </Button>
        {!isDirty && <p className="text-sm text-ink-faint">No unsaved changes</p>}
      </div>
    </form>
  );
}
