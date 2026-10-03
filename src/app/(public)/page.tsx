import { Suspense } from "react";
import Compatibility from "@/components/home/Compatibility";
import FaqPreview from "@/components/home/FaqPreview";
import FinalCta from "@/components/home/FinalCta";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import LiveStats, { LiveStatsSkeleton } from "@/components/home/LiveStats";
import MatchLens from "@/components/home/MatchLens";
import RequestBoardSection from "@/components/home/RequestBoardSection";
import RolesSection from "@/components/home/RolesSection";
import TrustSection from "@/components/home/TrustSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LiveStatsSkeleton />}>
        <LiveStats />
      </Suspense>
      <RequestBoardSection />
      <RolesSection />
      <HowItWorks />
      <Compatibility />
      <section className="bg-cream py-24">
        <div className="page-container">
          <MatchLens />
        </div>
      </section>
      <TrustSection />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
