"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { errorMessage } from "@/lib/client-api";
import { useWithdrawDonation } from "@/lib/queries/use-donor";

/** Backs out of an upcoming donation after a confirm step. */
export function WithdrawButton({ donationId, className, size = "md" }: { donationId: string; className?: string; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const withdraw = useWithdrawDonation();

  const confirm = () =>
    withdraw.mutate(donationId, {
      onSuccess: () => {
        setOpen(false);
        toast.success("You've withdrawn. The request is open for other donors again.");
      },
      onError: (err) => {
        setOpen(false);
        toast.error(errorMessage(err));
      },
    });

  return (
    <>
      <Button type="button" variant="outline" size={size} onClick={() => setOpen(true)} className={className}>
        I can&apos;t make it
      </Button>
      {open && (
        <ConfirmDialog title="Withdraw from this donation?" confirmLabel="Withdraw" tone="danger" pending={withdraw.isPending} onConfirm={confirm} onClose={() => setOpen(false)}>
          The request goes back on the board so another donor can help. Thank you for letting the hospital know.
        </ConfirmDialog>
      )}
    </>
  );
}
