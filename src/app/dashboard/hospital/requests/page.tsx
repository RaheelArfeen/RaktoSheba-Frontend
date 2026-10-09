import type { Metadata } from "next";
import { RequestsBoard } from "./components/requests-board";

export const metadata: Metadata = { title: "My requests" };

export default function HospitalRequestsPage() {
  return <RequestsBoard />;
}
