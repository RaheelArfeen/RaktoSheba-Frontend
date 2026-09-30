import Link from "next/link";
import { contact, footerNav } from "@/lib/site";
import Mark from "./Mark";

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-10">
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
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-3 px-5 py-6 text-xs font-semibold text-ink-muted sm:flex-row sm:items-center sm:px-8 lg:px-10">
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
