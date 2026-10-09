"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmergencyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bloodGroupLabel } from "@/lib/blood";
import { errorMessage } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import { emergencyLevel } from "@/lib/emergency";
import { timeAgo, unitsLabel } from "@/lib/format";
import { useCancelRequest, useVerifyRequest } from "@/lib/queries/use-admin";
import type { BloodRequest, EmergencyLevel } from "@/types";

const levelAccent: Record<EmergencyLevel, string> = {
  critical: "bg-blood",
  severe: "bg-blush-deep",
  urgent: "bg-sand-deep",
  standard: "bg-linen",
};

export function QueueRow({ request }: { request: BloodRequest }) {
  const [confirmAction, setConfirmAction] = useState<"verify" | "cancel" | null>(null);
  const verify = useVerifyRequest();
  const cancel = useCancelRequest();
  const pending = verify.isPending || cancel.isPending;

  const hospital = request.requester?.hospital;

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-[24px] border border-ink/10 bg-cream p-5 pl-6 transition-colors hover:border-ink/20 sm:flex-row sm:items-center sm:justify-between">
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1.5", levelAccent[emergencyLevel(request.urgency)])} />

      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-blush text-lg font-extrabold text-blood">
          {bloodGroupLabel[request.bloodGroup]}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="truncate font-semibold leading-none text-ink">{hospital?.name ?? "Unknown hospital"}</p>
          {hospital?.address && <p className="truncate text-sm text-ink-muted">{hospital.address}</p>}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs font-semibold text-ink-faint">{timeAgo(request.createdAt)}</span>
            <span className="text-xs text-ink-faint">·</span>
            <span className="text-xs font-semibold text-ink-faint">{unitsLabel(request.unitsNeeded)} needed</span>
            <EmergencyBadge urgency={request.urgency} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
        <Button variant="forest" size="sm" onClick={() => setConfirmAction("verify")} disabled={pending}>
          Verify
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirmAction("cancel")} disabled={pending}>
          Cancel
        </Button>
      </div>

      {confirmAction === "verify" && (
        <ConfirmDialog
          title="Verify this request?"
          confirmLabel="Verify"
          pending={verify.isPending}
          onConfirm={() =>
            verify.mutate(request.id, {
              onSuccess: () => {
                toast.success("Request verified — donors alerted.");
                setConfirmAction(null);
              },
              onError: (err) => {
                toast.error(errorMessage(err));
                setConfirmAction(null);
              },
            })
          }
          onClose={() => setConfirmAction(null)}
        >
          This moves the request to Open and alerts every compatible donor nearby.
        </ConfirmDialog>
      )}

      {confirmAction === "cancel" && (
        <ConfirmDialog
          title="Cancel this request?"
          confirmLabel="Cancel request"
          tone="danger"
          pending={cancel.isPending}
          onConfirm={() =>
            cancel.mutate(request.id, {
              onSuccess: () => {
                toast.success("Request cancelled.");
                setConfirmAction(null);
              },
              onError: (err) => {
                toast.error(errorMessage(err));
                setConfirmAction(null);
              },
            })
          }
          onClose={() => setConfirmAction(null)}
        >
          This permanently cancels the request. The hospital can post a new one at any time.
        </ConfirmDialog>
      )}
    </div>
  );
}
