import type { Metadata } from "next";
import { DonorOverview } from "./components/donor-overview";

export const metadata: Metadata = { title: "Donor dashboard" };

export default function DonorDashboard() {
  return <DonorOverview />;
}
