import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button";
import { adminApi } from "@/lib/admin";
import { getSession } from "@/lib/session";
import { QueueRow } from "./components/queue-row";

export const metadata: Metadata = { title: "Verification queue" };

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerificationQueuePage({ searchParams }: PageProps) {
  const session = (await getSession())!;
  const params = await searchParams;
  const page = typeof params.page === "string" ? Math.max(1, parseInt(params.page, 10) || 1) : 1;

  const { data, meta } = await adminApi.queue(session.accessToken, { page, limit: 20 });

  const totalPages = meta.totalPage ?? Math.ceil(meta.total / (meta.limit || 20));

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Verification queue</Eyebrow>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl tracking-[-.015em]">Pending requests</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {meta.total} request{meta.total === 1 ? "" : "s"} awaiting verification
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-ink/15 bg-cream p-10 text-center">
          <p className="font-display text-xl">Queue is clear</p>
          <p className="mt-2 text-sm text-ink-muted">No requests awaiting verification.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((request) => (
            <QueueRow key={request.id} request={request} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {page > 1 && (
            <ButtonLink href={`?page=${page - 1}`} variant="outline" size="sm">
              ← Prev
            </ButtonLink>
          )}
          <span className="text-sm text-ink-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <ButtonLink href={`?page=${page + 1}`} variant="outline" size="sm">
              Next →
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  );
}
