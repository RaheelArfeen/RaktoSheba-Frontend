import type { Metadata } from "next";
import { HospitalsList } from "./components/hospitals-list";

export const metadata: Metadata = { title: "Hospitals" };

export default function AdminHospitalsPage() {
  return <HospitalsList />;
}
