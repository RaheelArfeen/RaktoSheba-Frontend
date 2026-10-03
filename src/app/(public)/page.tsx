import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import LiveStats, { LiveStatsSkeleton } from "@/components/home/LiveStats";
import RequestBoardSection from "@/components/home/RequestBoardSection";
import RolesSection from "@/components/home/RolesSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LiveStatsSkeleton />}>
        <LiveStats />
      </Suspense>
      <RequestBoardSection />
      <RolesSection />
    </>
  );
}
