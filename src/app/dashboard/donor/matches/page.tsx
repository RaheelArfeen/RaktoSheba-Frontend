import type { Metadata } from "next";
import { DonorMatches } from "./components/matches-list";

export const metadata: Metadata = { title: "Requests I can help" };

export default function DonorMatchesPage() {
  return <DonorMatches />;
}
