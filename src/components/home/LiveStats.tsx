import { publicApi } from "@/lib/api/public";
import { Skeleton } from "@/components/ui/skeleton";

// Live network numbers straight from the database.
export default async function LiveStats() {
  const stats = await publicApi.stats().catch(() => null);

  const items = [
    { value: stats?.availableDonors, label: "Donors ready now" },
    { value: stats?.openRequests, label: "Open requests" },
    { value: stats?.verifiedHospitals, label: "Verified hospitals" },
    { value: stats?.completedDonations, label: "Donations completed" },
  ];

  return (
    <section className="border-b border-ink/10 bg-cream" aria-label="Network at a glance">
      <dl className="page-container grid grid-cols-2 gap-8 py-9 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dd className="font-display text-4xl tracking-[-.05em] text-blood">{item.value ?? "—"}</dd>
            <dt className="mt-1 text-xs font-bold tracking-[.15em] text-ink-muted uppercase">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function LiveStatsSkeleton() {
  return (
    <div className="border-b border-ink/10 bg-cream">
      <div className="page-container grid grid-cols-2 gap-8 py-9 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-9 w-16 bg-linen" />
            <Skeleton className="h-3 w-32 bg-linen" />
          </div>
        ))}
      </div>
    </div>
  );
}
