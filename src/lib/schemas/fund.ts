import { z } from "zod";

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
