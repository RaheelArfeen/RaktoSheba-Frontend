import type { Metadata } from "next";
import { DonorDonations } from "./components/donations-list";

export const metadata: Metadata = { title: "My donations" };

export default function DonorDonationsPage() {
  return <DonorDonations />;
}
