import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import LiveStats, { LiveStatsSkeleton } from "@/components/home/LiveStats";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LiveStatsSkeleton />}>
        <LiveStats />
      </Suspense>
    </>
  );
}
