import { z } from "zod";
import { BLOOD_GROUPS } from "@/lib/blood";
import type { BloodGroup } from "@/types";

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

/**
 * The sign-up wizard's flat form shape. Each step validates only its own fields;
 * the final values are turned into `RegisterValues` for the server action.
 */
export const registerFormSchema = z
  .object({
    role: z.enum(["DONOR", "HOSPITAL"], { error: "Choose how you'll use RaktoSheba." }),
    email: accountFields.email,
    password: accountFields.password,
    confirmPassword: z.string(),
    bloodGroup: z.string().optional(),
    hospitalName: z.string().optional(),
    hospitalAddress: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.confirmPassword !== v.password) ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords don't match." });
    if (v.role === "DONOR" && !BLOOD_GROUPS.includes(v.bloodGroup as (typeof BLOOD_GROUPS)[number]))
      ctx.addIssue({ code: "custom", path: ["bloodGroup"], message: "Choose your blood group." });
    if (v.role === "HOSPITAL") {
      if ((v.hospitalName ?? "").trim().length < 2) ctx.addIssue({ code: "custom", path: ["hospitalName"], message: "Enter the hospital's name." });
      if ((v.hospitalAddress ?? "").trim().length < 5) ctx.addIssue({ code: "custom", path: ["hospitalAddress"], message: "Enter the full address." });
    }
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const registerSteps: (keyof RegisterFormValues)[][] = [
  ["role"],
  ["email", "password", "confirmPassword"],
  ["bloodGroup", "hospitalName", "hospitalAddress"],
];

// ---- Onboarding (finish profile after Google sign-up) ----

export const donorProfileSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS as [string, ...string[]], { error: "Choose your blood group." }),
});

export const hospitalProfileSchema = z.object({
  hospitalName: z.string().trim().min(2, "Enter the hospital's name.").max(120, "Keep it under 120 characters."),
  hospitalAddress: z.string().trim().min(5, "Enter the full address.").max(200, "Keep it under 200 characters."),
});

export type DonorProfileValues = z.infer<typeof donorProfileSchema>;
export type HospitalProfileValues = z.infer<typeof hospitalProfileSchema>;

// ---- Blood request wizard (hospital) --------------------------------------

export const bloodRequestWizardSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS as [BloodGroup, ...BloodGroup[]], { error: "Choose the blood group needed." }),
  urgency: z.coerce.number().int().min(1).max(5, "Choose urgency."),
  units: z.coerce.number().int().min(1, "At least 1 unit.").max(10, "Max 10 units."),
  location: z.string().trim().min(3, "Add a hospital, area or landmark.").max(120, "Keep it under 120 characters."),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
});

export type BloodRequestWizardInput = z.input<typeof bloodRequestWizardSchema>;
export type BloodRequestWizardValues = z.output<typeof bloodRequestWizardSchema>;

/** Which fields each wizard step validates before moving on. Step 4 is review-only. */
export const requestWizardSteps: (keyof BloodRequestWizardValues)[][] = [
  ["bloodGroup"],
  ["urgency", "units"],
  ["location", "lat", "lng"],
  [],
];

// ---- Donor profile editing -------------------------------------------------

const todayInDhaka = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

export const donorEditSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS as [BloodGroup, ...BloodGroup[]], { error: "Choose your blood group." }),
  /** "YYYY-MM-DD" from a date input, or empty if they've never donated. */
  lastDonationAt: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Enter a valid date.")
    .refine((v) => !v || v <= todayInDhaka(), "The date can't be in the future."),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
});

export type DonorEditValues = z.infer<typeof donorEditSchema>;
