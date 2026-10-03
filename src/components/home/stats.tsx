import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { publicApi } from "@/lib/requests";

const LABELS = ["Donors ready now", "Open requests", "Verified hospitals", "Donations completed"];

async function LiveNumbers() {
  const stats = await publicApi.stats().catch(() => null);
  const values = [stats?.availableDonors, stats?.openRequests, stats?.verifiedHospitals, stats?.completedDonations];

  return (
    <dl className="grid grid-cols-2 gap-8 py-9 md:grid-cols-4">
      {LABELS.map((label, i) => (
        <div key={label}>
          <dd className="font-display text-4xl tracking-[-.015em] text-blood">{values[i] ?? "—"}</dd>
          <dt className="mt-1 text-xs font-bold tracking-[.15em] text-ink-muted uppercase">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Live network numbers straight from the database. */
export function StatsSection() {
  return (
    <section className="border-b border-ink/10 bg-cream" aria-label="Network at a glance">
      <Container>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-8 py-9 md:grid-cols-4">
              {LABELS.map((label) => (
                <div key={label} className="space-y-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          }
        >
          <LiveNumbers />
        </Suspense>
      </Container>
    </section>
  );
}
