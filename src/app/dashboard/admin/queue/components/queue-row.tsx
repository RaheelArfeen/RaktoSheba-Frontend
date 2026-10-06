"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { verifyRequest, cancelRequest } from "@/app/actions/admin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmergencyBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bloodGroupLabel } from "@/lib/blood";
import { timeAgo, unitsLabel } from "@/lib/format";
import type { BloodRequest } from "@/types";

type Props = {
  request: BloodRequest;
};

export function QueueRow({ request }: Props) {
  const [confirmAction, setConfirmAction] = useState<"verify" | "cancel" | null>(null);
  const [isPending, startTransition] = useTransition();

  const hospital = request.requester?.hospital;

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-ink/10 bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: blood group tile + details */}
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-blush text-blood text-lg font-extrabold">
          {bloodGroupLabel[request.bloodGroup]}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-ink leading-none">
            {hospital?.name ?? "Unknown hospital"}
          </p>
          {hospital?.address && (
            <p className="text-sm text-ink-muted">{hospital.address}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs text-ink-muted">{timeAgo(request.createdAt)}</span>
            <span className="text-xs text-ink-muted">·</span>
            <span className="text-xs text-ink-muted">{unitsLabel(request.unitsNeeded)}</span>
            <EmergencyBadge urgency={request.urgency} />
            <StatusBadge status={request.status} />
          </div>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex shrink-0 gap-2">
        <Button
          variant="forest"
          size="sm"
          onClick={() => setConfirmAction("verify")}
          disabled={isPending}
        >
          Verify
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmAction("cancel")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>

      {/* Verify confirm dialog */}
      {confirmAction === "verify" && (
        <ConfirmDialog
          title="Verify this request?"
          confirmLabel="Verify"
          onConfirm={() => {
            startTransition(async () => {
              const r = await verifyRequest(request.id);
              if ("error" in r) {
                toast.error(r.error);
              } else {
                toast.success("Request verified — donors alerted.");
              }
              setConfirmAction(null);
            });
          }}
          onClose={() => setConfirmAction(null)}
          pending={isPending}
        >
          This will move the request to Verified and notify compatible donors.
        </ConfirmDialog>
      )}

      {/* Cancel confirm dialog */}
      {confirmAction === "cancel" && (
        <ConfirmDialog
          title="Cancel this request?"
          confirmLabel="Cancel request"
          tone="danger"
          onConfirm={() => {
            startTransition(async () => {
              const r = await cancelRequest(request.id);
              if ("error" in r) {
                toast.error(r.error);
              } else {
                toast.success("Request cancelled.");
              }
              setConfirmAction(null);
            });
          }}
          onClose={() => setConfirmAction(null)}
          pending={isPending}
        >
          This permanently cancels the request. The hospital can post a new one.
        </ConfirmDialog>
      )}
    </div>
  );
}
