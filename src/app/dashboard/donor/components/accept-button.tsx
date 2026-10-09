"use client";

import { useId, useState } from "react";
import { HandHeart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { errorMessage } from "@/lib/client-api";
import { useAcceptRequest } from "@/lib/queries/use-donor";

/** "I can help" with a confirm step, so nobody commits to a hospital by accident. */
export function AcceptButton({
  requestId,
  hospital,
  disabledReason,
  className,
}: {
  requestId: string;
  hospital: string;
  /** When set, the button is disabled and this explains why. */
  disabledReason?: string | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const reasonId = useId();
  const accept = useAcceptRequest();

  const confirm = () =>
    accept.mutate(requestId, {
      onSuccess: () => {
        toast.success(`Thank you! ${hospital} can now see you're coming.`);
        setOpen(false);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
        setOpen(false);
      },
    });

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!!disabledReason}
        aria-describedby={disabledReason ? reasonId : undefined}
        className={className}
      >
        <HandHeart /> I can help
      </Button>
      {disabledReason && (
        <p id={reasonId} className="text-xs text-ink-faint sm:max-w-56 sm:text-right">
          {disabledReason}
        </p>
      )}
      {open && (
        <ConfirmDialog title="Confirm you can donate" confirmLabel="Yes, I'll go" pending={accept.isPending} onConfirm={confirm} onClose={() => setOpen(false)}>
          <p>
            You&apos;re telling <strong className="text-ink">{hospital}</strong> you&apos;ll come in to donate. Please only confirm if you can
            get there soon.
          </p>
          <p className="mt-2">If your plans change, you can withdraw from your dashboard so another donor can help.</p>
        </ConfirmDialog>
      )}
    </>
  );
}
