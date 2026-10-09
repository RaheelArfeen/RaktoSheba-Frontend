import type { Metadata } from "next";
import { HospitalProfileView } from "./profile-view";

export const metadata: Metadata = { title: "Hospital profile" };

export default function HospitalProfilePage() {
  return <HospitalProfileView />;
}
