import type { Metadata } from "next";
import { BadgeCheck, Building2, Clock, MapPin, PartyPopper } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ApiError } from "@/lib/api";
import { hospitalApi } from "@/lib/hospitals";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Hospital dashboard" };

export default async function HospitalDashboard({ searchParams }: PageProps<"/dashboard/hospital">) {
  const session = (await getSession())!;
  const { welcome } = await searchParams;
  const hospital = await hospitalApi.me(session.accessToken).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });

  return (
    <div className="space-y-8">
      {welcome && (
        <div className="flex items-start gap-4 rounded-[24px] bg-mint p-5">
          <PartyPopper className="mt-0.5 size-6 shrink-0 text-forest" />
          <div>
            <p className="font-extrabold text-forest-deep">Welcome to RaktoSheba!</p>
            <p className="mt-1 text-sm text-[#4a806c]">Your hospital account is ready. Our team will verify it shortly.</p>
          </div>
        </div>
      )}

      <div>
        <Eyebrow>Hospital workspace</Eyebrow>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-[-.015em]">{hospital?.name ?? "Your hospital"}</h1>
        {hospital && (
          <p className="mt-2 flex items-center gap-1.5 text-ink-muted">
            <MapPin size={15} /> {hospital.address}
          </p>
        )}
      </div>

      {!hospital ? (
        <div className="rounded-[26px] border border-dashed border-ink/15 bg-cream p-8">
          <p className="font-display text-2xl tracking-[-.01em]">Your hospital profile isn&apos;t set up yet.</p>
          <p className="mt-2 text-sm text-ink-muted">Add your hospital&apos;s name and address to start posting requests.</p>
        </div>
      ) : hospital.verified ? (
        <div className="flex items-start gap-4 rounded-[24px] border border-forest/20 bg-mint p-6">
          <BadgeCheck className="size-6 shrink-0 text-forest" />
          <div>
            <p className="font-extrabold text-forest-deep">Verified hospital</p>
            <p className="mt-1 text-sm text-[#4a806c]">Your requests go to compatible donors as soon as our team verifies each one.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 rounded-[24px] border border-sand-deep/20 bg-sand p-6">
          <Clock className="size-6 shrink-0 text-sand-deep" />
          <div>
            <p className="font-extrabold text-sand-deep">Waiting for verification</p>
            <p className="mt-1 text-sm text-ink-muted">An admin checks every new hospital before its requests reach donors. This usually takes less than a day.</p>
          </div>
        </div>
      )}

      <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
        <Building2 className="size-5 text-blood" />
        <p className="mt-4 font-extrabold">Blood requests</p>
        <p className="mt-1 text-sm text-ink-muted">Posting and tracking requests arrives in the next update of your workspace.</p>
      </div>
    </div>
  );
}
