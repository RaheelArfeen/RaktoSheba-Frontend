"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { fulfillRequest } from "@/app/actions/hospital";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/spinner";
import type { RequestStatus } from "@/types";

type FulfillButtonProps = {
  requestId: string;
  status: RequestStatus;
};

export function FulfillButton({ requestId, status }: FulfillButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (status !== "MATCHED") return null;

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await fulfillRequest(requestId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Request marked as fulfilled.");
        setOpen(false);
      }
    });
  };

  return (
    <>
      <Button variant="forest" onClick={() => setOpen(true)} disabled={pending}>
        {pending ? <Spinner className="text-white" /> : <CheckCircle2 />}
        Mark fulfilled
      </Button>

      {open && (
        <ConfirmDialog
          title="Mark request as fulfilled?"
          confirmLabel="Yes, mark fulfilled"
          tone="primary"
          pending={pending}
          onConfirm={handleConfirm}
          onClose={() => setOpen(false)}
        >
          This confirms the donation is complete and closes the request.
        </ConfirmDialog>
      )}
    </>
  );
}
