"use client";

import { useState } from "react";
import { Ban } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { roleLabel } from "@/components/dashboard/nav-config";
import { errorMessage } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { useSetUserBanned } from "@/lib/queries/use-admin";
import type { Role, UserProfile } from "@/types";

const roleTone: Record<Role, string> = {
  DONOR: "bg-mint text-forest",
  HOSPITAL: "bg-blush text-blood",
  ADMIN: "bg-sand text-sand-deep",
};

export function UserRow({ user }: { user: UserProfile }) {
  const [confirmAction, setConfirmAction] = useState<"ban" | "unban" | null>(null);
  const setBanned = useSetUserBanned();

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-ink/10 bg-cream p-5 transition-colors hover:border-ink/20 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full font-display text-lg",
            user.isBanned ? "bg-linen text-ink-faint" : "bg-blush text-maroon",
          )}
        >
          {user.email[0]?.toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className={cn("truncate font-bold", user.isBanned ? "text-ink-muted line-through decoration-ink-faint" : "text-ink")}>
            {user.email}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-[.12em] uppercase",
                roleTone[user.role],
              )}
            >
              {roleLabel[user.role]}
            </span>
            <span className="text-xs font-semibold text-ink-faint">Joined {formatDate(user.createdAt)}</span>
            {user.isVolunteer && <span className="text-xs font-semibold text-ink-faint">· Volunteer</span>}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end">
        {user.isBanned ? (
          <>
            <span className="rounded-full bg-blush px-3 py-1.5 text-xs font-bold text-blood">Banned</span>
            <Button className="flex-1 sm:flex-none" variant="soft" size="sm" onClick={() => setConfirmAction("unban")} disabled={setBanned.isPending}>
              Unban
            </Button>
          </>
        ) : (
          <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => setConfirmAction("ban")} disabled={setBanned.isPending}>
            <Ban size={14} /> Ban
          </Button>
        )}
      </div>

      {confirmAction === "ban" && (
        <ConfirmDialog
          title="Ban this user?"
          confirmLabel="Ban user"
          tone="danger"
          pending={setBanned.isPending}
          onConfirm={() =>
            setBanned.mutate(
              { userId: user.id, banned: true },
              {
                onSuccess: () => {
                  toast.success(`${user.email} banned.`);
                  setConfirmAction(null);
                },
                onError: (err) => {
                  toast.error(errorMessage(err));
                  setConfirmAction(null);
                },
              },
            )
          }
          onClose={() => setConfirmAction(null)}
        >
          The account is blocked immediately and can no longer sign in. You can unban them at any time.
        </ConfirmDialog>
      )}

      {confirmAction === "unban" && (
        <ConfirmDialog
          title="Unban this user?"
          confirmLabel="Unban"
          pending={setBanned.isPending}
          onConfirm={() =>
            setBanned.mutate(
              { userId: user.id, banned: false },
              {
                onSuccess: () => {
                  toast.success(`${user.email} unbanned.`);
                  setConfirmAction(null);
                },
                onError: (err) => {
                  toast.error(errorMessage(err));
                  setConfirmAction(null);
                },
              },
            )
          }
          onClose={() => setConfirmAction(null)}
        >
          They will be able to sign in again right away.
        </ConfirmDialog>
      )}
    </div>
  );
}
