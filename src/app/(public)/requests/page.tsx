import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import RequestCard from "@/components/requests/RequestCard";
import RequestFilters from "@/components/requests/RequestFilters";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { publicApi } from "@/lib/api/public";
import { boardHref, parseBoardParams } from "@/lib/requestBoard";

export const metadata: Metadata = {
  title: "Find blood requests",
  description:
    "Live, verified blood requests from hospitals across Bangladesh. Filter by blood group, urgency and area to find where you can help.",
};

export default async function RequestsPage({ searchParams }: PageProps<"/requests">) {
  const params = await searchParams;
  const query = parseBoardParams(params);
  const { data: requests, meta } = await publicApi.requestBoard(query);
  const totalPages = meta.totalPage ?? Math.ceil(meta.total / query.limit);

  const current = Object.fromEntries(
    Object.entries(params).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  );

  return (
    <>
      <PageHeader
        eyebrow="Live request board"
        title="Someone nearby needs your help."
        description="Every request here was verified by our team. Filter by your blood group and area to see where you can make a difference."
      />
      <section className="page-container space-y-6 py-10 sm:py-14">
        <RequestFilters />
        <div className="flex items-center justify-between text-sm font-semibold text-ink-muted">
          <p aria-live="polite">
            {meta.total === 0 ? "No requests" : `${meta.total} request${meta.total === 1 ? "" : "s"}`}
            {totalPages > 1 && ` · page ${query.page} of ${totalPages}`}
          </p>
        </div>
        {requests.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No requests match these filters"
            description="Try a different blood group or urgency, or clear the filters to see every open request."
            action={
              <Button asChild variant="outline">
                <Link href="/requests">Clear filters</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
        <Pagination page={query.page} totalPages={totalPages} hrefFor={(p) => boardHref(current, { page: p === 1 ? undefined : String(p) })} />
      </section>
    </>
  );
}
