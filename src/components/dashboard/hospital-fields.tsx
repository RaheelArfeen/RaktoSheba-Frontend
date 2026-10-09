"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { HOSPITAL_TYPES, type HospitalProfileValues } from "@/lib/validations";

const Optional = () => <span className="font-medium text-ink-faint">(optional)</span>;

type HospitalFieldsProps = {
  register: UseFormRegister<HospitalProfileValues>;
  control: Control<HospitalProfileValues>;
  errors: FieldErrors<HospitalProfileValues>;
};

/** Every hospital detail we collect, shared by onboarding and the profile page. */
export function HospitalFields({ register, control, errors }: HospitalFieldsProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="hospitalName">Hospital name</Label>
        <Input id="hospitalName" placeholder="e.g. Dinajpur General Hospital" aria-invalid={!!errors.hospitalName} {...register("hospitalName")} />
        <FieldError message={errors.hospitalName?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="hospitalType">Hospital type</Label>
          <Select id="hospitalType" aria-invalid={!!errors.hospitalType} {...register("hospitalType")}>
            <option value="">Choose a type</option>
            {HOSPITAL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.hospitalType?.message} />
        </div>
        <div>
          <Label htmlFor="licenseNumber">
            Registration / license number <Optional />
          </Label>
          <Input id="licenseNumber" placeholder="e.g. HOSP-12345" aria-invalid={!!errors.licenseNumber} {...register("licenseNumber")} />
          <FieldError message={errors.licenseNumber?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">
            Email <Optional />
          </Label>
          <Input id="email" type="email" autoComplete="organization" placeholder="hospital@example.com" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="website">
            Website <Optional />
          </Label>
          <Input id="website" type="url" placeholder="https://hospital.com" aria-invalid={!!errors.website} {...register("website")} />
          <FieldError message={errors.website?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="e.g. +880 1XXX XXXXXX" aria-invalid={!!errors.phone} {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="emergencyPhone">
            Emergency phone <Optional />
          </Label>
          <Input id="emergencyPhone" type="tel" placeholder="e.g. +880 1XXX XXXXXX" aria-invalid={!!errors.emergencyPhone} {...register("emergencyPhone")} />
          <FieldError message={errors.emergencyPhone?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="hospitalAddress">Address</Label>
        <Input id="hospitalAddress" placeholder="e.g. Dinajpur, Bangladesh" aria-invalid={!!errors.hospitalAddress} {...register("hospitalAddress")} />
        <FieldError message={errors.hospitalAddress?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="district">District</Label>
          <Input id="district" placeholder="e.g. Dinajpur" aria-invalid={!!errors.district} {...register("district")} />
          <FieldError message={errors.district?.message} />
        </div>
        <div>
          <Label htmlFor="upazila">
            Upazila / area <Optional />
          </Label>
          <Input id="upazila" placeholder="e.g. Sadar" aria-invalid={!!errors.upazila} {...register("upazila")} />
          <FieldError message={errors.upazila?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="openHours">
            Operating hours <Optional />
          </Label>
          <Input id="openHours" placeholder="e.g. 24/7" aria-invalid={!!errors.openHours} {...register("openHours")} />
          <FieldError message={errors.openHours?.message} />
        </div>
        <div>
          <Label id="emergency-service-label">Emergency service</Label>
          <Controller
            control={control}
            name="hasEmergencyService"
            render={({ field }) => (
              <div role="group" aria-labelledby="emergency-service-label" className="grid grid-cols-2 gap-2">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    aria-pressed={field.value === value}
                    onClick={() => field.onChange(value)}
                    className={cn(
                      "rounded-2xl border py-3.5 text-sm font-extrabold transition-all",
                      field.value === value
                        ? value
                          ? "border-blood/30 bg-blush text-blood"
                          : "border-forest/30 bg-mint text-forest"
                        : "border-ink/10 bg-paper text-ink-muted hover:border-ink/25",
                    )}
                  >
                    {value ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            )}
          />
          <p className="mt-1.5 text-xs text-ink-faint">Shown to donors so they know where to go in an emergency.</p>
        </div>
      </div>

      <div>
        <Label htmlFor="description">
          About the hospital <Optional />
        </Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Facilities, blood bank capacity, how donors should check in…"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>
    </div>
  );
}
