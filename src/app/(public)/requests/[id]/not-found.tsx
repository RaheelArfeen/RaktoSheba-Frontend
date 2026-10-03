import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";

export default function RequestNotFound() {
  return (
    <div className="page-container py-20">
      <EmptyState
        icon={SearchX}
        title="This request isn't available"
        description="It may have been removed, or it hasn't been verified yet. Open requests are always listed on the board."
        action={
          <Button asChild>
            <Link href="/requests">See open requests</Link>
          </Button>
        }
      />
    </div>
  );
}
