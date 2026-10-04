"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { withdrawDonation } from "@/app/actions/donor";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

/** Backs out of an upcoming donation after a confirm step. */
export function WithdrawButton({ donationId, className }: { donationId: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const confirm = () =>
    startTransition(async () => {
      const result = await withdrawDonation(donationId);
      setOpen(false);
      if ("error" in result) toast.error(result.error);
      else toast.success("You've withdrawn. The request is open for other donors again.");
    });

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className={className}>
        I can&apos;t make it
      </Button>
      {open && (
        <ConfirmDialog title="Withdraw from this donation?" confirmLabel="Withdraw" tone="danger" pending={pending} onConfirm={confirm} onClose={() => setOpen(false)}>
          The request goes back on the board so another donor can help. Thank you for letting the hospital know.
        </ConfirmDialog>
      )}
    </>
  );
}
