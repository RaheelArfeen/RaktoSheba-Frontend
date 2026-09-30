import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Mark from "./Mark";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" aria-label="RaktoSheba home">
          <Mark />
        </Link>
        <NavLinks className="hidden items-center gap-8 text-sm font-semibold text-ink-muted lg:flex" />
        <div className="flex items-center gap-2">
          <Button asChild variant="soft" size="sm" className="hidden sm:inline-flex">
            <Link href="/emergency">
              <CircleAlert /> Emergency help
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="group hidden sm:inline-flex">
            <Link href="/dashboard">
              Open workspace <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
