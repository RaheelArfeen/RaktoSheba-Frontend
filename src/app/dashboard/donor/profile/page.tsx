import type { Metadata } from "next";
import { DonorProfileView } from "./profile-view";

export const metadata: Metadata = { title: "My profile" };

export default function DonorProfilePage() {
  return <DonorProfileView />;
}
