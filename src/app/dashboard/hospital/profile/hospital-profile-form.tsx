"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { updateHospitalProfile } from "@/app/actions/hospital";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { hospitalEditSchema, type HospitalEditValues } from "@/lib/validations";
import type { Hospital } from "@/types";

export function HospitalProfileForm({ hospital }: { hospital: Hospital }) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<HospitalEditValues>({
    resolver: zodResolver(hospitalEditSchema),
    defaultValues: {
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
    },
  });

  const onSubmit = (values: HospitalEditValues) =>
    startTransition(async () => {
      const result = await updateHospitalProfile(values);
      if ("error" in result) return void toast.error(result.error);
      toast.success("Profile saved.");
      reset(values);
    });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7 rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-8"
    >
      {/* Verification status */}
      <div className="flex items-center gap-3">
        {hospital.verified ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-extrabold text-forest">
            <BadgeCheck size={14} />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-extrabold text-sand-deep">
            <Clock size={14} />
            Pending verification
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="hospitalName">Hospital name</Label>
        <Input
          id="hospitalName"
          type="text"
          aria-invalid={!!errors.hospitalName}
          {...register("hospitalName")}
        />
        <FieldError message={errors.hospitalName?.message} />
      </div>

      <div>
        <Label htmlFor="hospitalAddress">Hospital address</Label>
        <Input
          id="hospitalAddress"
          type="text"
          aria-invalid={!!errors.hospitalAddress}
          {...register("hospitalAddress")}
        />
        <FieldError message={errors.hospitalAddress?.message} />
      </div>

      <div className="flex items-center gap-3 border-t border-ink/10 pt-6">
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
