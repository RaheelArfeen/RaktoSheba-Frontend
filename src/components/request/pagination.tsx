import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const edge = "grid size-10 place-items-center rounded-full border border-ink/10 bg-cream text-ink-muted transition-colors";

/** Link-based pagination: works without JavaScript and every page has its own URL. */
export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (page: number) => string }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} aria-label="Previous page" className={cn(edge, "hover:text-blood")}>
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span aria-hidden className={cn(edge, "opacity-40")}>
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
        <Link href={hrefFor(page + 1)} aria-label="Next page" className={cn(edge, "hover:text-blood")}>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span aria-hidden className={cn(edge, "opacity-40")}>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
