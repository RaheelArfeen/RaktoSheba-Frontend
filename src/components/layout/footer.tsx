import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { contact, footerNav } from "@/lib/site";
import { Logo } from "./logo";
import { Eyebrow } from "@/components/ui/eyebrow";

/** `showEmergency` is off for hospitals, who post requests rather than ask for help. */
export function SiteFooter({ showEmergency = true }: { showEmergency?: boolean }) {
  return (
  <footer className="border-t border-ink/10 bg-cream">
    {showEmergency && (
      <Container className="pt-12">
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-maroon px-7 py-8 text-cream sm:px-10 md:flex-row md:items-center md:justify-between">
          <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full border-[32px] border-white/[.06]" />
          <div className="relative">
            <Eyebrow className="text-mint-strong">In an emergency?</Eyebrow>
            <p className="mt-2 max-w-xl font-display text-3xl leading-[1.02] tracking-[-.04em] sm:text-4xl">
              Get help now—no account needed.
            </p>
          </div>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/emergency" variant="light">
              Get emergency help <ArrowRight />
            </ButtonLink>
            <a
              href={`tel:${contact.emergencyLine}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-sm font-bold text-cream transition-colors hover:border-white/50 hover:bg-white/10"
            >
              <Phone size={16} /> Call {contact.emergencyLine}
            </a>
          </div>
        </div>
      </Container>
    )}

    <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div>
        <Logo />
        <p className="mt-5 max-w-[300px] text-sm leading-6 text-ink-muted">
          Connecting hospitals with compatible, nearby blood donors across Bangladesh—made for the moments that matter
          most.
        </p>
        <p className="mt-5 text-sm font-bold text-ink-soft">
          Emergency line <span className="font-display text-xl text-blood">{contact.emergencyLine}</span>
        </p>
      </div>
      {footerNav.map((group) => (
        <div key={group.title}>
          <Eyebrow className="text-ink-faint">{group.title}</Eyebrow>
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
    </Container>

    <div className="border-t border-ink/10">
      <Container className="flex flex-col justify-between gap-3 py-6 text-xs font-semibold text-ink-muted sm:flex-row sm:items-center">
        <span>
          © {new Date().getFullYear()} RaktoSheba · {contact.city}
        </span>
        <div className="flex gap-5">
          <a href={`mailto:${contact.email}`} className="transition-colors hover:text-blood">
            {contact.email}
          </a>
          <a href={contact.apiDocs} target="_blank" rel="noreferrer" className="transition-colors hover:text-blood">
            API documentation ↗
          </a>
        </div>
      </Container>
    </div>
  </footer>
  );
}
