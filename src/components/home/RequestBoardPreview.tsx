import Link from "next/link";
import { ChevronRight, HeartHandshake } from "lucide-react";
import { publicApi } from "@/lib/api/public";
import RequestCard from "@/components/requests/RequestCard";

// The four most urgent open requests, on the home page.
export default async function RequestBoardPreview() {
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
