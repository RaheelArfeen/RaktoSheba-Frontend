"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AppShell({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname();

  // Dashboard pages render their own layout (sidebar + page scroll).
  // Skip the public header/footer entirely for those routes.
  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      {/* Lets keyboard and screen-reader users jump past the header straight to the page. */}
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-blood px-5 py-3 text-sm font-bold text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      {header}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      {footer}
    </div>
  );
}
