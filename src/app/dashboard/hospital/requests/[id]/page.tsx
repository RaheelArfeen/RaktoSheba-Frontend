import type { Metadata } from "next";
import { RequestDetail } from "./components/request-detail";

export const metadata: Metadata = { title: "Request details" };

export default async function HospitalRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequestDetail id={id} />;
}
