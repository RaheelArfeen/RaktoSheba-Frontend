import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { EmergencyBanner } from "@/components/layout/emergency-banner";
import { SiteFooter } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/header";
import { QueryProvider } from "@/components/providers/query-provider";
import { env } from "@/config/env";
import "./globals.css";

const display = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const sans = Manrope({
  variable: "--font-manrope",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <QueryProvider>
          <AppShell
            header={
              <>
                <EmergencyBanner />
                <SiteHeader />
              </>
            }
            footer={<SiteFooter />}
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
