import { AudienceSection } from "@/components/home/audience";
import { CompatibilitySection } from "@/components/home/compatibility";
import { CtaSection } from "@/components/home/cta";
import { FaqSection } from "@/components/home/faq";
import { HeroSection } from "@/components/home/hero";
import { HowItWorksSection } from "@/components/home/how-it-works";
import { MatchLensSection } from "@/components/home/match-lens";
import { RequestBoardSection } from "@/components/home/request-board";
import { StatsSection } from "@/components/home/stats";
import { TrustSection } from "@/components/home/trust";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <RequestBoardSection />
      <AudienceSection />
      <HowItWorksSection />
      <CompatibilitySection />
      <MatchLensSection />
      <TrustSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
