import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowLeft, ArrowRight, Building2, CalendarClock, Droplets, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusTimeline from "@/components/requests/StatusTimeline";
import ShareButton from "@/components/shared/ShareButton";
import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { bloodGroupLabel, compatibleDonors } from "@/lib/blood";
import { EMERGENCY_LEVELS, emergencyLevel, requestStatusLabel } from "@/lib/emergency";
import { formatDateTime, timeAgo, unitsLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

// Shared by generateMetadata and the page, so the API is called once per request.
const getRequest = cache(async (id: string) => {
  try {
    return await publicApi.requestById(id);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps<"/requests/[id]">): Promise<Metadata> {
  const request = await getRequest((await params).id);
  const group = bloodGroupLabel[request.bloodGroup];
  const where = request.hospital?.name ?? "a partner hospital";
  return {
    title: `${group} blood needed at ${where}`,
    description: `${unitsLabel(request.unitsNeeded)} of ${group} blood requested at ${where}. See if you can help.`,
  };
}

export default async function RequestDetailPage({ params }: PageProps<"/requests/[id]">) {
  const request = await getRequest((await params).id);
  const level = emergencyLevel(request.urgency);
  const info = EMERGENCY_LEVELS[level];
  const open = request.status === "VERIFIED";
  const group = bloodGroupLabel[request.bloodGroup];
  const donors = compatibleDonors(request.bloodGroup);

  return (
    <section className="page-container py-10 sm:py-14">
      <Link href="/requests" className="inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-blood">
        <ArrowLeft size={16} /> All requests
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <div className="space-y-6">
          <div
            className={cn(
              "relative overflow-hidden rounded-[30px] p-7 sm:p-10",
              open && (level === "critical" || level === "severe") ? "bg-maroon text-cream" : "border border-ink/10 bg-cream",
            )}
          >
            <div className="absolute -top-20 -right-12 size-64 rounded-full border-[36px] border-current opacity-[.06]" />
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {open ? (
                    <Badge variant={info.badge}>{info.label}</Badge>
                  ) : (
                    <Badge variant={request.status === "CANCELLED" ? "neutral" : "success"}>{requestStatusLabel[request.status]}</Badge>
                  )}
                  <span className="text-xs font-semibold opacity-70">Posted {timeAgo(request.createdAt)}</span>
                </div>
                <h1 className="mt-5 font-display text-5xl leading-[.95] tracking-[-.06em] sm:text-6xl">
                  {group} blood needed
                </h1>
                <p className="mt-4 max-w-md leading-7 opacity-80">{open ? info.description : requestStatusLabel[request.status] + "."}</p>
              </div>
              <div className="grid size-28 shrink-0 place-items-center rounded-[28px] bg-blush font-display text-5xl text-blood">
                {group}
              </div>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Droplets, label: "Units needed", value: unitsLabel(request.unitsNeeded) },
              { icon: Building2, label: "Hospital", value: request.hospital?.name ?? "Partner hospital" },
              { icon: CalendarClock, label: "Posted", value: formatDateTime(request.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-[22px] border border-ink/10 bg-cream p-5">
                <Icon size={18} className="text-blood" />
                <dt className="mt-3 text-xs font-bold tracking-[.12em] text-ink-faint uppercase">{label}</dt>
                <dd className="mt-1 font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-8">
            <p className="eyebrow text-blood">Who can donate</p>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              A patient needing {group} blood can safely receive from {donors.length === 8 ? "every blood group" : "these groups"}:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {donors.map((g) => (
                <span key={g} className="rounded-xl bg-blush px-3 py-2 text-sm font-extrabold text-blood">
                  {bloodGroupLabel[g]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-7">
            <p className="eyebrow text-blood">Where</p>
            <p className="mt-3 font-display text-2xl tracking-[-.04em]">{request.hospital?.name ?? "Partner hospital"}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin size={14} /> {request.hospital?.address ?? "Bangladesh"}
            </p>
            {open && (
              <Button asChild className="mt-6 w-full">
                <Link href={`/login?next=/requests/${request.id}`}>
                  I can help <ArrowRight />
                </Link>
              </Button>
            )}
            <div className={cn(open ? "mt-3" : "mt-6", "[&>button]:w-full")}>
              <ShareButton title={`${group} blood needed`} text={`${group} blood is needed at ${request.hospital?.name ?? "a hospital"}. Can you help?`} />
            </div>
            {open && (
              <p className="mt-4 text-xs leading-5 text-ink-faint">
                Sign in as a donor to accept. We check your blood group and eligibility before confirming the match.
              </p>
            )}
          </div>
          <div className="rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-7">
            <p className="eyebrow mb-6 text-blood">Progress</p>
            <StatusTimeline request={request} />
          </div>
        </aside>
      </div>
    </section>
  );
}
