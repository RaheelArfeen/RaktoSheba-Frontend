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
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
