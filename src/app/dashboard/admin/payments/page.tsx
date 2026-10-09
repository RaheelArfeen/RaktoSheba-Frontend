import type { Metadata } from "next";
import { PaymentsPanel } from "./components/payments-panel";

export const metadata: Metadata = { title: "Payments & audit log" };

export default function AdminPaymentsPage() {
  return <PaymentsPanel />;
}
