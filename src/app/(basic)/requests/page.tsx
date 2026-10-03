import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { Filters } from "@/components/request/filters";
import { Pagination } from "@/components/request/pagination";
import { RequestCard } from "@/components/request/request-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { boardHref, parseBoardParams, publicApi } from "@/lib/requests";

export const metadata: Metadata = {
  title: "Find blood requests",
  description: "Live, verified blood requests from hospitals across Bangladesh. Filter by blood group, urgency and area to find where you can help.",
};

export default async function RequestsPage({ searchParams }: PageProps<"/requests">) {
  const params = await searchParams;
  const query = parseBoardParams(params);
  const { data: requests, meta } = await publicApi.requestBoard(query);
  const totalPages = meta.totalPage ?? Math.ceil(meta.total / query.limit);
  const current = Object.fromEntries(Object.entries(params).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute -top-24 -right-24 -z-10 size-[380px] rounded-full bg-mint/40 blur-3xl" />
        <Container className="py-14 sm:py-16">
          <Eyebrow>Live request board</Eyebrow>
          <h1 className="mt-4 max-w-[820px] font-display text-5xl leading-[1.08] tracking-[-.02em] sm:text-6xl">Someone nearby needs your help.</h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-ink-muted">
            Every request here was verified by our team. Filter by your blood group and area to see where you can make a difference.
          </p>
        </Container>
      </section>

      <Container className="space-y-6 py-10 sm:py-14">
        {/* Filters reads useSearchParams, which needs a Suspense boundary. */}
        <Suspense fallback={<Skeleton className="h-36 rounded-[26px]" />}>
          <Filters />
        </Suspense>

        <p aria-live="polite" className="text-sm font-semibold text-ink-muted">
          {meta.total === 0 ? "No requests" : `${meta.total} request${meta.total === 1 ? "" : "s"}`}
          {totalPages > 1 && ` · page ${query.page} of ${totalPages}`}
        </p>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center rounded-[26px] border border-dashed border-ink/15 bg-cream px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-mint text-forest">
              <SearchX className="size-6" />
            </span>
            <p className="mt-5 font-display text-2xl tracking-[-.01em]">No requests match these filters</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">Try a different blood group or urgency, or clear the filters to see every open request.</p>
            <ButtonLink href="/requests" variant="outline" className="mt-6">
              Clear filters
            </ButtonLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}

        <Pagination page={query.page} totalPages={totalPages} hrefFor={(p) => boardHref(current, { page: p === 1 ? undefined : String(p) })} />
      </Container>
    </>
  );
}
