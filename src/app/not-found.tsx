import type { Metadata } from "next";
import { Compass, Home, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Page not found" };

/** Rendered for `notFound()` calls and for any URL that matches no route. */
export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-3xl bg-blush text-blood shadow-sm">
          <Compass className="size-9" />
        </span>
        <div className="max-w-md space-y-2">
          <h1 className="font-display text-5xl tracking-[-.015em]">Nothing here.</h1>
          <p className="text-sm leading-relaxed text-ink-muted">The page you&apos;re looking for doesn&apos;t exist, or it may have been moved.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/">
            <Home /> Back home
          </ButtonLink>
          <ButtonLink href="/requests" variant="outline">
            <Search /> Browse requests
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
