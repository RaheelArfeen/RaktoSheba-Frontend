"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HandHeart } from "lucide-react";
import { toast } from "sonner";
import { acceptRequest } from "@/app/actions/donor";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const reasonId = useId();
  const [pending, startTransition] = useTransition();

  const confirm = () =>
    startTransition(async () => {
      const result = await acceptRequest(requestId);
      if ("error" in result) {
        toast.error(result.error);
        setOpen(false);
        return;
      }
      toast.success(`Thank you! ${hospital} can now see you're coming.`);
      setOpen(false);
      router.replace("/dashboard/donor");
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
        <ConfirmDialog title="Confirm you can donate" confirmLabel="Yes, I'll go" pending={pending} onConfirm={confirm} onClose={() => setOpen(false)}>
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
