"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/spinner";
import { errorMessage } from "@/lib/client-api";
import { useFulfillRequest } from "@/lib/queries/use-hospital";

export function FulfillButton({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const fulfill = useFulfillRequest();

  const handleConfirm = () => {
    fulfill.mutate(requestId, {
      onSuccess: () => {
        toast.success("Request marked as fulfilled.");
        setOpen(false);
      },
      onError: (error) => toast.error(errorMessage(error)),
    });
  };

  return (
    <>
      <Button variant="forest" onClick={() => setOpen(true)} disabled={fulfill.isPending}>
        {fulfill.isPending ? <Spinner className="text-white" /> : <CheckCircle2 />}
        Mark fulfilled
      </Button>

      {open && (
        <ConfirmDialog
          title="Mark request as fulfilled?"
          confirmLabel="Yes, mark fulfilled"
          tone="primary"
          pending={fulfill.isPending}
          onConfirm={handleConfirm}
          onClose={() => setOpen(false)}
        >
          This confirms the donation is complete and closes the request.
        </ConfirmDialog>
      )}
    </>
  );
}
