import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/** Shown on donor pages when the account has no donor profile yet. */
export function NoProfile() {
  return (
    <div className="rounded-[26px] border border-dashed border-ink/15 bg-cream p-6 sm:p-8">
      <p className="font-display text-xl tracking-[-.01em]">Let&apos;s finish your donor profile.</p>
      <p className="mt-2 text-sm text-ink-muted">Tell us your blood group so we can show you the requests you can help.</p>
      <ButtonLink href="/onboarding?next=/dashboard/donor" className="mt-6">
        Add my blood group <ArrowRight />
      </ButtonLink>
    </div>
  );
}
