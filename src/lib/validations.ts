import { z } from "zod";
import { BLOOD_GROUPS } from "@/lib/blood";

// ---- Eligibility ----

const yesNo = z.enum(["yes", "no"], { error: "Please choose an answer." });

export const eligibilitySchema = z
  .object({
    age: z.coerce
      .number({ error: "Enter your age in years." })
      .int("Use whole years.")
      .min(1, "Enter your age in years.")
      .max(120, "Enter a real age."),
    weight: z.coerce.number({ error: "Enter your weight in kg." }).min(1, "Enter your weight in kg.").max(300, "Enter a real weight."),
    donatedBefore: yesNo,
    lastDonation: z.string().optional(),
    feelsWell: yesNo,
    recentIllness: yesNo,
    onAntibiotics: yesNo,
  })
  .superRefine((value, ctx) => {
    if (value.donatedBefore !== "yes") return;
    if (!value.lastDonation) {
      ctx.addIssue({ code: "custom", path: ["lastDonation"], message: "When did you last donate?" });
    } else if (new Date(value.lastDonation) > new Date()) {
      ctx.addIssue({ code: "custom", path: ["lastDonation"], message: "That date is in the future." });
    }
  });

export type EligibilityInput = z.input<typeof eligibilitySchema>;
export type EligibilityValues = z.output<typeof eligibilitySchema>;

// ---- Emergency ----

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

// ---- Contact ----

export const CONTACT_TOPICS = [
  { value: "donor", label: "I want to donate" },
  { value: "hospital", label: "Hospital partnership" },
  { value: "request", label: "About a blood request" },
  { value: "other", label: "Something else" },
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(80, "Keep it under 80 characters."),
  email: z.email("Enter a valid email address."),
  topic: z.enum(CONTACT_TOPICS.map((t) => t.value) as [string, ...string[]], { error: "Choose a topic." }),
  message: z
    .string()
    .trim()
    .min(20, "Add a little more detail (at least 20 characters).")
    .max(2000, "Keep it under 2,000 characters."),
});

export type ContactValues = z.infer<typeof contactSchema>;

// ---- Fund ----

export const FUND_PRESETS = [5, 10, 25, 50] as const;

export const fundSchema = z.object({
  amount: z.coerce
    .number({ error: "Enter an amount." })
    .min(1, "The minimum contribution is $1.")
    .max(1000, "For gifts over $1,000, please contact us.")
    .multipleOf(0.01, "Use at most two decimal places."),
  purpose: z.enum(["EMERGENCY_FUND", "PLATFORM_DONATION"], { error: "Choose where your gift goes." }),
});

export type FundInput = z.input<typeof fundSchema>;
export type FundValues = z.output<typeof fundSchema>;

// ---- Auth ----

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginValues = z.infer<typeof loginSchema>;

const accountFields = {
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Use at least 6 characters.").max(72, "Use 72 characters or fewer."),
};

// Matches the backend rules: donors need a blood group, hospitals a name (2+) and address (5+).
export const registerSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("DONOR"), ...accountFields, bloodGroup: z.enum(BLOOD_GROUPS as [string, ...string[]], { error: "Choose your blood group." }) }),
  z.object({
    role: z.literal("HOSPITAL"),
    ...accountFields,
    hospitalName: z.string().trim().min(2, "Enter the hospital's name.").max(120, "Keep it under 120 characters."),
    hospitalAddress: z.string().trim().min(5, "Enter the full address.").max(200, "Keep it under 200 characters."),
  }),
]);

export type RegisterValues = z.infer<typeof registerSchema>;
