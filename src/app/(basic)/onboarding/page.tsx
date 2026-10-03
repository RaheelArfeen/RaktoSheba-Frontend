import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { api } from "@/lib/api";
import { dashboardPath, getSession, safeNext } from "@/lib/session";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Finish your profile", robots: { index: false } };

/** One last step after signing up with Google: blood group for donors, details for hospitals. */
export default async function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  const session = await getSession();
  if (!session) redirect("/auth/login?next=/onboarding");
  const { role } = session.user;
  const nextPath = safeNext((await searchParams).next, "") || undefined;
  if (role === "ADMIN") redirect(dashboardPath(role));

  // Already has a profile? Nothing to finish.
  const hasProfile = await api(role === "DONOR" ? "/donors/me" : "/hospitals/me", { token: session.accessToken, cache: "no-store" })
    .then(() => true)
    .catch(() => false);
  if (hasProfile) redirect(nextPath ?? dashboardPath(role));

  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-[520px]">
        <Eyebrow>One last step</Eyebrow>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl leading-[1.08] tracking-[-.02em]">{role === "DONOR" ? "What's your blood group?" : "Tell us about your hospital."}</h1>
        <p className="mt-4 mb-8 leading-7 text-ink-muted">Signed in as {session.user.email}. This takes a few seconds.</p>
        <OnboardingForm role={role} next={nextPath} />
      </div>
    </Container>
  );
}
