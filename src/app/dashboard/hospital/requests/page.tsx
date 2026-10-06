import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { Pagination } from "@/components/request/pagination";
import { RequestCard } from "@/components/request/request-card";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { hospitalRequestApi } from "@/lib/hospitals";
import { boardHref, parseBoardParams } from "@/lib/requests";
import { getSession } from "@/lib/session";
import type { BloodRequest } from "@/types";
import { HospitalFilters } from "./components/hospital-filters";

export const metadata: Metadata = { title: "My requests" };

const BASE = "/dashboard/hospital/requests";

/** Build a hospital requests board URL, mirroring boardHref but rooted at BASE. */
function hospitalBoardHref(current: Record<string, string>, changes: Record<string, string | undefined>) {
  const url = boardHref(current, changes);
  // boardHref returns "/requests?..." — swap the base
  return url.replace(/^\/requests/, BASE);
}

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

export default async function HospitalRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = (await getSession())!;
  const params = await searchParams;
  const query = parseBoardParams(params);

  const { data: requests, meta } = await hospitalRequestApi.myRequests(session.accessToken, query);

  const totalPages = meta.totalPage ?? Math.ceil(meta.total / query.limit);
  const current = Object.fromEntries(
    Object.entries(params).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  );

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>My requests</Eyebrow>
        <h1 className="mt-2 font-display text-3xl tracking-[-.015em] sm:text-4xl">Blood requests</h1>
      </div>

      {/* HospitalFilters reads useSearchParams — needs Suspense boundary */}
      <Suspense fallback={<Skeleton className="h-36 rounded-[26px]" />}>
        <HospitalFilters />
      </Suspense>

      <p aria-live="polite" className="text-sm font-semibold text-ink-muted">
        {meta.total === 0 ? "No requests" : `${meta.total} request${meta.total === 1 ? "" : "s"}`}
        {totalPages > 1 && ` · page ${query.page} of ${totalPages}`}
      </p>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center rounded-[26px] border border-dashed border-ink/15 bg-cream px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-blush text-blood">
            <SearchX className="size-6" />
          </span>
          <p className="mt-5 font-display text-xl tracking-[-.01em]">No requests found</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
            Try adjusting the filters, or post your first blood request.
          </p>
          <ButtonLink href="/dashboard/hospital/requests/new" className="mt-6">
            New request
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <RequestCard key={r.id} request={toPublicRequest(r)} />
          ))}
        </div>
      )}

      <Pagination
        page={query.page}
        totalPages={totalPages}
        hrefFor={(p) => hospitalBoardHref(current, { page: p === 1 ? undefined : String(p) })}
      />
    </div>
  );
}
