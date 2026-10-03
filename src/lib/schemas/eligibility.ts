import { z } from "zod";

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
