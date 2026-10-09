import type { Metadata } from "next";
import { QueueList } from "./components/queue-list";

export const metadata: Metadata = { title: "Verification queue" };

export default function VerificationQueuePage() {
  return <QueueList />;
}
