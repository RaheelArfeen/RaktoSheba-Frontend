import { z } from "zod";

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
