import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
