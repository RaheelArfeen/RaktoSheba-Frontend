"use client";

import { useEffect, useRef, type ReactNode } from "react";
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

/** A small "are you sure?" box. Mount it only while open; Escape or the backdrop closes it. */
export function ConfirmDialog({ title, children, confirmLabel, tone = "primary", pending, onConfirm, onClose }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !pending && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, pending]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-5" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button type="button" aria-label="Close" onClick={() => !pending && onClose()} className="absolute inset-0 bg-ink/45 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-[26px] border border-ink/10 bg-cream p-6 shadow-[0_30px_80px_rgba(62,41,36,.25)] sm:p-7">
        <h2 id="confirm-title" className="font-display text-xl tracking-[-.01em]">
          {title}
        </h2>
        <div className="mt-3 text-sm leading-6 text-ink-muted">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} type="button" variant="outline" onClick={onClose} disabled={pending}>
            Not now
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={tone === "danger" ? "bg-ink shadow-none hover:bg-ink-soft" : undefined}
          >
            {pending ? <Spinner className="text-cream" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
