"use client";

import type { ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "./button";
import { Spinner } from "./spinner";

type ConfirmDialogProps = {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  tone?: "primary" | "danger";
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * A small "are you sure?" box, built on Radix AlertDialog (focus trap, Escape to close,
 * screen-reader labels). Mount it only while open; it stays open while `pending`.
 */
export function ConfirmDialog({ title, children, confirmLabel, tone = "primary", pending, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open onOpenChange={(open) => !open && !pending && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm" />
        <AlertDialog.Content className="animate-fade-in fixed top-1/2 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[26px] border border-ink/10 bg-cream p-6 shadow-[0_30px_80px_rgba(62,41,36,.25)] sm:p-7">
          <AlertDialog.Title className="font-display text-xl tracking-[-.01em]">{title}</AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className="mt-3 text-sm leading-6 text-ink-muted">{children}</div>
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Not now
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                type="button"
                // Keep the dialog open while the action runs; the caller closes it when done.
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm();
                }}
                disabled={pending}
                className={tone === "danger" ? "bg-ink shadow-none hover:bg-ink-soft" : undefined}
              >
                {pending ? <Spinner className="text-cream" /> : confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
