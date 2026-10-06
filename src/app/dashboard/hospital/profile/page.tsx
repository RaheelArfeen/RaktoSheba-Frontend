import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { hospitalApi } from "@/lib/hospitals";
import { getSession } from "@/lib/session";
import { HospitalProfileForm } from "./hospital-profile-form";
import { LicenceUpload } from "./licence-upload";

export const metadata: Metadata = { title: "Hospital profile" };

export default async function HospitalProfilePage() {
  const session = (await getSession())!;
  const hospital = await hospitalApi.me(session.accessToken).catch(() => null);

  if (!hospital) {
    return (
      <div className="max-w-xl rounded-[26px] border border-ink/10 bg-cream p-8 text-center">
        <p className="text-lg font-bold">No hospital profile yet</p>
        <p className="mt-2 text-sm text-ink-muted">
          Your account doesn&apos;t have a hospital profile attached. Please contact support at{" "}
          <a href="mailto:support@raktosheba.org" className="font-semibold text-blood underline-offset-2 hover:underline">
            support@raktosheba.org
          </a>{" "}
          to get it set up.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-8">
        <Eyebrow>Hospital profile</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">
          {hospital.name || "Your hospital"}
        </h1>
        <p className="mt-2 text-ink-muted">Signed in as {session.user.email}</p>
      </div>
      <LicenceUpload licenseDocUrl={hospital.licenseDocUrl ?? null} />
      <HospitalProfileForm hospital={hospital} />
    </div>
  );
}
