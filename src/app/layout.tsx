import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Unbounded } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { EmergencyBanner } from "@/components/layout/emergency-banner";
import { SiteFooter } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/header";
import { QueryProvider } from "@/components/providers/query-provider";
import { env } from "@/config/env";
import { getSession } from "@/lib/session";
import "./globals.css";

// Headings: wide, rounded and distinctive — the open letter shapes stay readable from far away.
const heading = Unbounded({
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

// Body: designed by the Braille Institute to be readable from a distance and for low vision,
// with letter shapes that are hard to confuse (I, l, 1, O, 0).
const body = Atkinson_Hyperlegible_Next({
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const description =
  "RaktoSheba connects hospitals with compatible, nearby blood donors when every minute matters.";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "RaktoSheba — Blood, when it matters",
    template: "%s · RaktoSheba",
  },
  description,
  applicationName: "RaktoSheba",
  keywords: ["blood donation", "Bangladesh", "emergency blood", "blood donor", "hospital blood request"],
  openGraph: {
    title: "RaktoSheba — Blood, when it matters",
    description,
    siteName: "RaktoSheba",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#611a23",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <QueryProvider>
          <AppShell
            header={
              <>
                <EmergencyBanner />
                <SiteHeader user={session?.user} />
              </>
            }
            footer={<SiteFooter showEmergency={session?.user.role !== "HOSPITAL"} />}
          >
            {children}
          </AppShell>
        </QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "16px",
              background: "var(--color-cream)",
              color: "var(--color-ink)",
              border: "1px solid rgba(62, 41, 36, 0.1)",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
