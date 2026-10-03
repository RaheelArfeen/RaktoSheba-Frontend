import { z } from "zod";
import { BLOOD_GROUPS } from "@/lib/blood";

export const emergencySummarySchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS as [string, ...string[]], { error: "Choose the blood group needed." }),
  units: z.coerce.number().int().min(1, "At least 1 unit.").max(10, "For more than 10 units, call the hospital directly."),
  location: z.string().trim().min(3, "Add the hospital, area or a landmark.").max(120, "Keep it under 120 characters."),
  patientName: z.string().trim().max(60, "Keep it under 60 characters.").optional(),
  urgency: z.enum(["now", "today"], { error: "Choose how soon blood is needed." }),
});

export type EmergencySummaryInput = z.input<typeof emergencySummarySchema>;
export type EmergencySummary = z.output<typeof emergencySummarySchema>;

/** Which fields each wizard step validates before moving on. */
export const emergencySteps: (keyof EmergencySummaryInput)[][] = [["bloodGroup"], ["units", "location", "patientName"], ["urgency"]];
