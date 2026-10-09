"use client";

import Link from "next/link";
import { ArrowLeft, Building2, CalendarClock, Droplets, MapPin } from "lucide-react";
import { FetchingHint, QueryError } from "@/components/dashboard/list-controls";
import { StatusTimeline } from "@/components/request/status-timeline";
import { EmergencyBadge, StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { bloodGroupLabel } from "@/lib/blood";
import { emergencyLevel, EMERGENCY_LEVELS, requestStatusLabel } from "@/lib/emergency";
import { formatDateTime, timeAgo, unitsLabel } from "@/lib/format";
import { useHospitalRequest } from "@/lib/queries/use-hospital";
import type { BloodRequestDetail, PublicRequestDetail } from "@/types";
import { FulfillButton } from "../fulfill-button";

/** Map a hospital BloodRequestDetail to the shape StatusTimeline expects. */
function toPublicRequestDetail(r: BloodRequestDetail): PublicRequestDetail {
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
    donation: r.donation
      ? { status: r.donation.status, scheduledAt: r.donation.scheduledAt, completedAt: r.donation.completedAt }
      : null,
  };
}

function BackLink() {
  return (
    <Link
      href="/dashboard/hospital/requests"
      className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-blood"
    >
      <ArrowLeft size={16} /> Back to requests
    </Link>
  );
}

export function RequestDetail({ id }: { id: string }) {
  const { data: request, isPending, isError, error, refetch, isFetching } = useHospitalRequest(id);

  if (isPending) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_.65fr]">
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-[30px]" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[118px] rounded-[22px]" />
              <Skeleton className="h-[118px] rounded-[22px]" />
              <Skeleton className="h-[118px] rounded-[22px]" />
              <Skeleton className="h-[118px] rounded-[22px]" />
            </div>
          </div>
          <Skeleton className="h-96 rounded-[26px]" />
        </div>
      </div>
    );
  }

  const notFound = error instanceof ApiError && (error.status === 404 || error.status === 400);
  if (notFound) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-[28px] border border-ink/10 bg-cream p-10 sm:p-12">
          <h1 className="font-display text-2xl tracking-[-.01em] sm:text-3xl">Request not found</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-muted">
            This request doesn&apos;t exist, or you don&apos;t have access to it.
          </p>
          <ButtonLink href="/dashboard/hospital/requests" variant="outline" className="mt-8">
            ← Back to requests
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <BackLink />
        <QueryError error={error} onRetry={refetch} />
      </div>
    );
  }

  const group = bloodGroupLabel[request.bloodGroup];
  const level = emergencyLevel(request.urgency);
  const open = request.status === "VERIFIED";

  const facts = [
    { icon: Droplets, label: "Blood group", value: group },
    { icon: CalendarClock, label: "Units needed", value: unitsLabel(request.unitsNeeded) },
    { icon: Building2, label: "Urgency", value: EMERGENCY_LEVELS[level].label },
    { icon: MapPin, label: "Created", value: formatDateTime(request.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackLink />
        <FetchingHint active={isFetching} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_.65fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Hero card */}
          <div className="relative overflow-hidden rounded-[30px] border border-ink/10 bg-cream p-6 sm:p-10">
            <div className="absolute -top-20 -right-12 size-64 rounded-full border-[36px] border-blood opacity-[.04]" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                {open ? (
                  <EmergencyBadge urgency={request.urgency} />
                ) : (
                  <StatusBadge status={request.status} />
                )}
                <span className="text-xs font-semibold text-ink-muted">
                  Posted {timeAgo(request.createdAt)}
                </span>
              </div>
              <h1 className="mt-5 font-display text-3xl leading-[1.08] tracking-[-.02em] sm:text-4xl">
                {group} blood request
              </h1>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                {requestStatusLabel[request.status]}
                {request.requester.hospital ? ` · ${request.requester.hospital.name}` : ""}
              </p>
            </div>
          </div>

          {/* Facts grid */}
          <dl className="grid grid-cols-2 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-[22px] border border-ink/10 bg-cream p-4 sm:p-5">
                <Icon size={18} className="text-blood" />
                <dt className="mt-3 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">
                  {label}
                </dt>
                <dd className="mt-1 font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Matched donor card */}
          {request.status === "MATCHED" && request.donation && (
            <div className="rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-7">
              <Eyebrow>Matched donor</Eyebrow>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blush font-display text-sm font-extrabold text-blood">
                    {bloodGroupLabel[request.donation.donor.bloodGroup]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{request.donation.donor.user.email}</p>
                    <p className="text-xs text-ink-muted">
                      Blood group: {bloodGroupLabel[request.donation.donor.bloodGroup]}
                    </p>
                  </div>
                </div>
                {request.donation.scheduledAt && (
                  <p className="text-sm text-ink-muted">
                    Scheduled: {formatDateTime(request.donation.scheduledAt)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          {/* Fulfill button — only when MATCHED */}
          {request.status === "MATCHED" && <FulfillButton requestId={id} />}

          {/* Status timeline */}
          <div className="rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-7">
            <Eyebrow className="mb-6">Progress</Eyebrow>
            <StatusTimeline request={toPublicRequestDetail(request)} />
          </div>

          {/* Hospital info */}
          {request.requester.hospital && (
            <div className="rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-7">
              <Eyebrow>Hospital</Eyebrow>
              <p className="mt-3 font-display text-lg tracking-[-.01em]">
                {request.requester.hospital.name}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                <MapPin size={14} className="shrink-0" />
                {request.requester.hospital.address}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
