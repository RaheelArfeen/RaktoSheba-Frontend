"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { errorMessage } from "@/lib/client-api";
import { useUploadLogo } from "@/lib/queries/use-hospital";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Pick a logo, preview it, then upload. Checked here first so people don't wait on a doomed upload. */
export function LogoUpload({ logoUrl }: { logoUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const uploadLogo = useUploadLogo();
  const pending = uploadLogo.isPending;

  // Free the preview's memory when it changes or the component goes away.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const choose = (picked: File | undefined) => {
    if (!picked) return;
    if (!TYPES.includes(picked.type)) return toast.error("Please choose a JPG, PNG or WEBP image.");
    if (picked.size > MAX_BYTES) return toast.error("The logo must be smaller than 5 MB.");
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const cancel = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = () => {
    if (!file) return;
    uploadLogo.mutate(file, {
      onSuccess: () => {
        toast.success("Logo updated.");
        cancel();
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  const shown = preview ?? logoUrl;

  return (
    <div className="flex flex-col items-start gap-5 rounded-[26px] border border-ink/10 bg-cream p-6 sm:flex-row sm:items-center sm:p-8">
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element -- local preview or Cloudinary URL
        <img src={shown} alt="Your hospital logo" className="size-24 shrink-0 rounded-[22px] bg-paper object-contain p-2 ring-4 ring-paper" />
      ) : (
        <span className="grid size-24 shrink-0 place-items-center rounded-[22px] bg-linen text-ink-faint">
          <Building2 size={34} />
        </span>
      )}
      <div>
        <p className="font-bold">Hospital logo</p>
        <p className="mt-1 text-sm text-ink-muted">
          Optional. Shown next to your requests so donors recognise you. JPG, PNG or WEBP, up to 5 MB.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          id="logo"
          onChange={(e) => choose(e.target.files?.[0])}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {file ? (
            <>
              <Button type="button" onClick={upload} disabled={pending}>
                {pending ? <Spinner className="text-cream" /> : <><Upload /> Upload logo</>}
              </Button>
              <Button type="button" variant="ghost" onClick={cancel} disabled={pending}>
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              <Upload /> {logoUrl ? "Change logo" : "Add a logo"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
