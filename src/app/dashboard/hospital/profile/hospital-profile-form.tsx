"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Ban, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { HospitalFields } from "@/components/dashboard/hospital-fields";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { errorMessage } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import { VERIFICATION_META, toHospitalFormValues } from "@/lib/hospitals";
import { useUpdateHospitalProfile } from "@/lib/queries/use-hospital";
import { hospitalEditSchema, type HospitalEditValues } from "@/lib/validations";
import type { Hospital, VerificationStatus } from "@/types";

const VERIFICATION_ICON: Record<VerificationStatus, typeof BadgeCheck> = {
  VERIFIED: BadgeCheck,
  PENDING: Clock,
  REJECTED: Ban,
};

const VERIFICATION_HINT: Record<VerificationStatus, string> = {
  VERIFIED: "Your requests reach compatible donors once each one passes the admin check.",
  PENDING: "Our team reviews new hospitals before their requests reach donors. This usually takes less than a day.",
  REJECTED: "Your details didn't pass review. Update anything that's changed below and our team will look again.",
};

export function HospitalProfileForm({ hospital }: { hospital: Hospital }) {
  const save = useUpdateHospitalProfile();
  const pending = save.isPending;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<HospitalEditValues>({
    resolver: zodResolver(hospitalEditSchema),
    defaultValues: toHospitalFormValues(hospital),
  });

  const onSubmit = (values: HospitalEditValues) =>
    save.mutate(values, {
      onSuccess: () => {
        toast.success("Profile saved.");
        reset(values);
      },
      onError: (error) => toast.error(errorMessage(error)),
    });

  const status = VERIFICATION_META[hospital.verificationStatus];
  const StatusIcon = VERIFICATION_ICON[hospital.verificationStatus];

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7 rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="font-display text-xl tracking-[-.01em]">Hospital details</p>
          <p className="mt-1 max-w-xl text-sm leading-6 text-ink-muted">{VERIFICATION_HINT[hospital.verificationStatus]}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold",
            status.pill,
          )}
        >
          <StatusIcon size={14} />
          {hospital.verificationStatus === "PENDING" ? "Pending verification" : status.label}
        </span>
      </div>

      <HospitalFields register={register} control={control} errors={errors} />

      <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6">
        <Button type="submit" disabled={pending || !isDirty}>
          {pending ? (
            <Spinner className="text-cream" />
          ) : (
            <>
              <Check /> Save changes
            </>
          )}
        </Button>
        {!isDirty && <p className="text-sm text-ink-faint">No unsaved changes</p>}
      </div>
    </form>
  );
}
