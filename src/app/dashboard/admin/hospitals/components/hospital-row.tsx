"use client";

import { useState } from "react";
import { BadgeCheck, Building2, ExternalLink, FileText, MapPin } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import { VERIFICATION_META, hospitalTypeLabel } from "@/lib/hospitals";
import { useSetHospitalVerification } from "@/lib/queries/use-admin";
import type { Hospital, VerificationStatus } from "@/types";

type Decision = Exclude<VerificationStatus, "PENDING">;

const DIALOG: Record<Decision, { title: string; confirmLabel: string; tone: "primary" | "danger"; body: string }> = {
  VERIFIED: {
    title: "Verify this hospital?",
    confirmLabel: "Verify",
    tone: "primary",
    body: "This marks the hospital as checked. Its name and status are shown to donors alongside every request it posts.",
  },
  REJECTED: {
    title: "Reject this hospital?",
    confirmLabel: "Reject",
    tone: "danger",
    body: "This flags the hospital as not verified, and donors see the flag next to its requests. You can review it again any time.",
  },
};

export function HospitalRow({ hospital }: { hospital: Hospital }) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const setVerification = useSetHospitalVerification();
  const status = VERIFICATION_META[hospital.verificationStatus];
  const typeLabel = hospitalTypeLabel(hospital.type);
  const busy = setVerification.isPending;

  const run = (next: Decision) =>
    setVerification.mutate(
      { id: hospital.id, status: next },
      {
        onSuccess: () => {
          toast.success(`${hospital.name} ${next === "VERIFIED" ? "verified" : "rejected"}.`);
          setDecision(null);
        },
        onError: (err) => {
          toast.error(errorMessage(err));
          setDecision(null);
        },
      },
    );

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-ink/10 bg-cream p-5 transition-colors hover:border-ink/20 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        {hospital.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL; next/image would need remote config
          <img src={hospital.logoUrl} alt="" className="size-11 shrink-0 rounded-[14px] bg-paper object-contain p-1" />
        ) : (
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-[14px]", status.pill)}>
            <Building2 size={19} />
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-ink">{hospital.name}</p>
            {typeLabel && (
              <span className="rounded-full bg-linen px-2.5 py-0.5 text-[11px] font-extrabold text-ink-soft">
                {typeLabel}
              </span>
            )}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-muted">
            <MapPin size={13} className="shrink-0 text-ink-faint" />
            {hospital.address}
            {hospital.district && <span className="text-ink-faint">· {hospital.district}</span>}
            {hospital.upazila && <span className="text-ink-faint">· {hospital.upazila}</span>}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {hospital.user?.email && <span className="font-semibold text-ink-faint">{hospital.user.email}</span>}
            {hospital.phone && <span className="font-semibold text-ink-faint">{hospital.phone}</span>}
            {hospital.licenseNumber && <span className="font-semibold text-ink-faint">Licence {hospital.licenseNumber}</span>}
            {hospital.licenseDocUrl ? (
              <a
                href={hospital.licenseDocUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-extrabold text-blood hover:text-blood-deep"
              >
                <FileText size={13} /> View licence <ExternalLink size={11} />
              </a>
            ) : (
              <span className="font-semibold text-ink-faint">No licence on file</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 lg:justify-end">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold", status.pill)}>
          <BadgeCheck size={13} className={hospital.verificationStatus === "VERIFIED" ? undefined : "opacity-50"} />
          {status.label}
        </span>
        {hospital.verificationStatus !== "VERIFIED" && (
          <Button
            className="flex-1 lg:flex-none"
            variant="forest"
            size="sm"
            onClick={() => setDecision("VERIFIED")}
            disabled={busy}
          >
            Verify
          </Button>
        )}
        {hospital.verificationStatus !== "REJECTED" && (
          <Button
            className="flex-1 lg:flex-none"
            variant="outline"
            size="sm"
            onClick={() => setDecision("REJECTED")}
            disabled={busy}
          >
            Reject
          </Button>
        )}
      </div>

      {decision && (
        <ConfirmDialog
          title={DIALOG[decision].title}
          confirmLabel={DIALOG[decision].confirmLabel}
          tone={DIALOG[decision].tone}
          pending={busy}
          onConfirm={() => run(decision)}
          onClose={() => setDecision(null)}
        >
          {DIALOG[decision].body}
        </ConfirmDialog>
      )}
    </div>
  );
}
