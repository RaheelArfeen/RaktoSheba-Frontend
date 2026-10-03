import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, HeartHandshake } from "lucide-react";
import { RequestCard } from "@/components/request/request-card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { RequestCardSkeleton } from "@/components/ui/skeleton";
import { publicApi } from "@/lib/requests";

async function UrgentRequests() {
  const requests = await publicApi.urgentRequests(4).catch(() => null);

  if (!requests) {
    return (
      <div className="rounded-[24px] border border-dashed border-ink/15 bg-cream p-10 text-center text-sm font-semibold text-ink-muted">
        The live board is unavailable right now. Please check back shortly.
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[24px] border border-dashed border-ink/15 bg-cream p-10 text-center">
        <HeartHandshake className="size-8 text-forest" />
        <p className="mt-3 font-bold">No open requests right now</p>
        <p className="mt-1 text-sm text-ink-muted">Every verified need currently has a donor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
      <Link
        href="/requests"
        className="flex items-center justify-center gap-2 rounded-[24px] border border-dashed border-ink/15 py-4 text-sm font-extrabold text-blood transition-colors hover:border-blood/30 hover:bg-cream"
      >
        See every open request <ChevronRight size={16} />
      </Link>
    </div>
  );
}

/** The four most urgent open requests. */
export function RequestBoardSection() {
  return (
    <section id="urgent-requests" className="scroll-mt-24 py-24">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
        <div className="max-w-[420px] lg:sticky lg:top-28">
          <Eyebrow className="mb-4">Live request board</Eyebrow>
          <h2 className="font-display text-5xl leading-[.96] tracking-[-.06em] sm:text-6xl">The right donor is closer than you think.</h2>
          <p className="mt-6 leading-7 text-ink-muted">
            Hospitals post verified requests. Donors see only the matches they can safely help with—sorted by urgency and distance.
          </p>
          <Link href="/requests" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-blood hover:text-blood-deep">
            Browse all requests <ChevronRight size={16} />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <RequestCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <UrgentRequests />
        </Suspense>
      </Container>
    </section>
  );
}
