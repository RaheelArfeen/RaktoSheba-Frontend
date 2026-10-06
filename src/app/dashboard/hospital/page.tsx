import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, CheckCircle2, Clock, Droplets, MapPin, PartyPopper } from "lucide-react";
import { RequestCard } from "@/components/request/request-card";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ApiError } from "@/lib/api";
import { hospitalApi, hospitalRequestApi } from "@/lib/hospitals";
import { getSession } from "@/lib/session";
import type { BloodRequest } from "@/types";

export const metadata: Metadata = { title: "Hospital dashboard" };

/** Convert a hospital's BloodRequest to the shape RequestCard expects. */
function toPublicRequest(r: BloodRequest) {
  return {
    id: r.id,
    bloodGroup: r.bloodGroup,
    unitsNeeded: r.unitsNeeded,
    urgency: r.urgency,
    status: r.status,
    createdAt: r.createdAt,
    hospital: r.requester.hospital
      ? { name: r.requester.hospital.name, address: r.requester.hospital.address }
      : null,
  };
}

export default async function HospitalDashboard({ searchParams }: PageProps<"/dashboard/hospital">) {
  const session = (await getSession())!;
  const { welcome } = await searchParams;

  const hospital = await hospitalApi.me(session.accessToken).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });

  const recentResult = await hospitalRequestApi
    .myRequests(session.accessToken, { limit: 5, sortBy: "createdAt", sortOrder: "desc" })
    .catch(() => ({ data: [] as BloodRequest[], meta: { page: 1, limit: 5, total: 0 } }));

  const requests = recentResult.data;
  const total = recentResult.meta.total;
  const open = requests.filter((r) => r.status === "VERIFIED").length;
  const fulfilled = requests.filter((r) => r.status === "FULFILLED").length;

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
        <h1 className="mt-2 font-display text-3xl sm:text-4xl tracking-[-.015em]">{hospital?.name ?? "Your hospital"}</h1>
        {hospital && (
          <p className="mt-2 flex items-center gap-1.5 text-ink-muted">
            <MapPin size={15} /> {hospital.address}
          </p>
        )}
      </div>

      {!hospital ? (
        <div className="rounded-[26px] border border-dashed border-ink/15 bg-cream p-8">
          <p className="font-display text-xl tracking-[-.01em]">Your hospital profile isn&apos;t set up yet.</p>
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

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <Droplets className="size-5 text-blood" />
          <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Total requests</p>
          <p className="mt-1 font-display text-3xl sm:text-4xl">{total}</p>
        </div>
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <Building2 className="size-5 text-forest" />
          <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Open</p>
          <p className="mt-1 font-display text-3xl sm:text-4xl">{open}</p>
        </div>
        <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
          <CheckCircle2 className="size-5 text-forest" />
          <p className="mt-4 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">Fulfilled</p>
          <p className="mt-1 font-display text-3xl sm:text-4xl">{fulfilled}</p>
        </div>
      </div>

      {/* Recent requests */}
      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="recent-heading" className="font-display text-xl tracking-[-.01em] sm:text-2xl">
            Recent requests
          </h2>
          {total > 0 && (
            <Link
              href="/dashboard/hospital/requests"
              className="inline-flex items-center gap-1 text-sm font-bold text-blood hover:underline"
            >
              See all requests <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map((r) => (
              <RequestCard key={r.id} request={toPublicRequest(r)} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-ink/15 bg-cream p-8 text-center">
            <p className="font-bold">No requests yet.</p>
            <p className="mt-1 text-sm text-ink-muted">Post your first blood request to get matched with donors.</p>
          </div>
        )}

        <ButtonLink href="/dashboard/hospital/requests/new" className="mt-2">
          New request
        </ButtonLink>
      </section>
    </div>
  );
}
