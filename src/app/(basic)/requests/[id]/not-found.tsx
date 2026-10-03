import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function RequestNotFound() {
  return (
    <Container className="py-20">
      <div className="flex flex-col items-center rounded-[26px] border border-dashed border-ink/15 bg-cream px-6 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-mint text-forest">
          <SearchX className="size-6" />
        </span>
        <p className="mt-5 font-display text-2xl tracking-[-.01em]">This request isn&apos;t available</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">
          It may have been removed, or it hasn&apos;t been verified yet. Open requests are always listed on the board.
        </p>
        <ButtonLink href="/requests" className="mt-6">
          See open requests
        </ButtonLink>
      </div>
    </Container>
  );
}
