import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RequestCardSkeleton } from "@/components/requests/RequestCard";
import RequestBoardPreview from "./RequestBoardPreview";

export default function RequestBoardSection() {
  return (
    <section id="urgent-requests" className="page-container scroll-mt-24 py-24">
      <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
        <div className="max-w-[420px] lg:sticky lg:top-28">
          <p className="eyebrow mb-4 text-blood">Live request board</p>
          <h2 className="font-display text-5xl leading-[.96] tracking-[-.06em] sm:text-6xl">
            The right donor is closer than you think.
          </h2>
          <p className="mt-6 leading-7 text-ink-muted">
            Hospitals post verified requests. Donors see only the matches they can safely help with—sorted by urgency
            and distance.
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
          <RequestBoardPreview />
        </Suspense>
      </div>
    </section>
  );
}
