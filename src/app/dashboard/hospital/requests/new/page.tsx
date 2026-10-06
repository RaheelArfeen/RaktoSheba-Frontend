import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { NewRequestWizard } from "./new-request-wizard";

export const metadata: Metadata = { title: "New blood request" };

export default function NewRequestPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Eyebrow>New request</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Post a blood request</h1>
      </div>
      <NewRequestWizard />
    </div>
  );
}
