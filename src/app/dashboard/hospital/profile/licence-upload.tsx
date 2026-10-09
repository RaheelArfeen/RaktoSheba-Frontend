"use client";

import { useRef, useState } from "react";
import { FileCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { errorMessage } from "@/lib/client-api";
import { useUploadLicence } from "@/lib/queries/use-hospital";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_BYTES = 5 * 1024 * 1024;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function LicenceUpload({ licenseDocUrl }: { licenseDocUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const uploadLicence = useUploadLicence();
  const pending = uploadLicence.isPending;

  const choose = (picked: File | undefined) => {
    if (!picked) return;
    if (!ALLOWED_TYPES.includes(picked.type))
      return toast.error("Please choose a JPG, PNG, WEBP image or a PDF document.");
    if (picked.size > MAX_BYTES) return toast.error("The file must be smaller than 5 MB.");
    setFile(picked);
  };

  const cancel = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = () => {
    if (!file) return;
    uploadLicence.mutate(file, {
      onSuccess: () => {
        toast.success("Licence uploaded.");
        cancel();
      },
      onError: (error) => toast.error(errorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-5 rounded-[26px] border border-ink/10 bg-cream p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linen text-ink-faint">
          <FileCheck size={22} />
        </span>
        <div className="flex-1">
          <p className="font-bold">Licence document</p>
          <p className="mt-1 text-sm text-ink-muted">
            Upload your hospital&apos;s registration or licence. JPG, PNG, WEBP or PDF, up to 5 MB.
          </p>
          {licenseDocUrl && (
            <a
              href={licenseDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline-offset-2 hover:underline"
            >
              <FileCheck size={14} />
              View current licence
            </a>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        id="licence"
        onChange={(e) => choose(e.target.files?.[0])}
      />

      {file ? (
        <div className="space-y-3">
          <p className="text-sm text-ink-soft">
            <span className="font-semibold">{file.name}</span>
            <span className="ml-2 text-ink-faint">({formatBytes(file.size)})</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={upload} disabled={pending}>
              {pending ? <Spinner className="text-cream" /> : <><Upload /> Upload licence</>}
            </Button>
            <Button type="button" variant="ghost" onClick={cancel} disabled={pending}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <Upload /> {licenseDocUrl ? "Replace licence" : "Upload licence"}
          </Button>
        </div>
      )}
    </div>
  );
}
