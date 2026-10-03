import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Builds the href for a page number, keeping the other URL params. */
  hrefFor: (page: number) => string;
};

// Link-based pagination: works without JavaScript and every page has its own URL.
export default function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const edge = "grid size-10 place-items-center rounded-full border border-ink/10 bg-cream text-ink-muted transition-colors";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(edge, "hover:text-blood")} aria-label="Previous page">
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className={cn(edge, "opacity-40")} aria-hidden>
          <ChevronLeft size={16} />
        </span>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-ink-faint">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid size-10 place-items-center rounded-full text-sm font-extrabold transition-colors",
              p === page ? "bg-blood text-cream" : "border border-ink/10 bg-cream text-ink-muted hover:text-blood",
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(edge, "hover:text-blood")} aria-label="Next page">
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={cn(edge, "opacity-40")} aria-hidden>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
