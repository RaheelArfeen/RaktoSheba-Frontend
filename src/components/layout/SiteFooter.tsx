import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact, footerNav } from "@/lib/site";
import Mark from "./Mark";

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="page-container pt-12">
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-maroon px-7 py-8 text-cream sm:px-10 md:flex-row md:items-center md:justify-between">
          <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full border-[32px] border-white/[.06]" />
          <div className="relative">
            <p className="eyebrow text-mint-strong">In an emergency?</p>
            <p className="mt-2 max-w-xl font-display text-3xl leading-[1.02] tracking-[-.04em] sm:text-4xl">
              Get help now—no account needed.
            </p>
          </div>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-cream text-blood shadow-none hover:bg-white">
              <Link href="/emergency">
                Get emergency help <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/25 bg-transparent text-cream hover:border-white/50 hover:bg-white/10">
              <a href={`tel:${contact.emergencyLine}`}>
                <Phone /> Call {contact.emergencyLine}
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="page-container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" aria-label="RaktoSheba home">
            <Mark />
          </Link>
          <p className="mt-5 max-w-[300px] text-sm leading-6 text-ink-muted">
            Connecting hospitals with compatible, nearby blood donors across Bangladesh—made for the moments that
            matter most.
          </p>
          <p className="mt-5 text-sm font-bold text-ink-soft">
            Emergency line <span className="font-display text-xl text-blood">{contact.emergencyLine}</span>
          </p>
        </div>
        {footerNav.map((group) => (
          <div key={group.title}>
            <p className="eyebrow text-ink-faint">{group.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold text-ink-soft">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-blood">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/10">
        <div className="page-container flex flex-col justify-between gap-3 py-6 text-xs font-semibold text-ink-muted sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RaktoSheba · {contact.city}</span>
          <div className="flex gap-5">
            <a href={`mailto:${contact.email}`} className="transition-colors hover:text-blood">
              {contact.email}
            </a>
            <a href={contact.apiDocs} target="_blank" rel="noreferrer" className="transition-colors hover:text-blood">
              API documentation ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
