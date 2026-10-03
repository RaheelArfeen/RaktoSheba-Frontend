import { PageLoader } from "@/components/ui/spinner";

/** Shown automatically while a route segment without its own `loading.tsx` renders. */
export default function Loading() {
  return <PageLoader label="Loading RaktoSheba…" />;
}
