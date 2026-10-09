import type { Metadata } from "next";
import { HospitalOverview } from "./components/hospital-overview";

export const metadata: Metadata = { title: "Hospital dashboard" };

export default function HospitalDashboard() {
  return <HospitalOverview />;
}
