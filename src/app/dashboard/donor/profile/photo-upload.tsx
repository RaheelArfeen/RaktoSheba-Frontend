"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Camera, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { errorMessage } from "@/lib/client-api";
import { useUploadDonorPhoto } from "@/lib/queries/use-donor";

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Pick a photo, preview it, then upload. Checked here first so people don't wait on a doomed upload. */
export function PhotoUpload({ photoUrl }: { photoUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const uploadPhoto = useUploadDonorPhoto();
  const pending = uploadPhoto.isPending;

  // Free the preview's memory when it changes or the component goes away.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const choose = (picked: File | undefined) => {
    if (!picked) return;
    if (!TYPES.includes(picked.type)) return toast.error("Please choose a JPG, PNG or WEBP image.");
    if (picked.size > MAX_BYTES) return toast.error("The photo must be smaller than 4 MB.");
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
    uploadPhoto.mutate(file, {
      onSuccess: () => {
        toast.success("Photo updated.");
        cancel();
      },
      onError: (err) => toast.error(errorMessage(err)),
    });
  };

  const shown = preview ?? photoUrl;

  return (
    <div className="flex flex-col items-start gap-5 rounded-[26px] border border-ink/10 bg-cream p-6 sm:flex-row sm:items-center sm:p-8">
      {shown ? (
        <Image
          src={shown}
          alt="Your profile photo"
          width={96}
          height={96}
          // A just-picked file is a local blob: preview, which the image optimiser can't fetch.
          unoptimized={shown.startsWith("blob:")}
          className="size-24 shrink-0 rounded-full object-cover ring-4 ring-paper"
        />
      ) : (
        <span className="grid size-24 shrink-0 place-items-center rounded-full bg-linen text-ink-faint">
          <UserRound size={36} />
        </span>
      )}
      <div>
        <p className="font-bold">Profile photo</p>
        <p className="mt-1 text-sm text-ink-muted">Optional. A friendly face helps hospital staff recognise you. JPG, PNG or WEBP, up to 4 MB.</p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="photo" onChange={(e) => choose(e.target.files?.[0])} />
        <div className="mt-4 flex flex-wrap gap-2">
          {file ? (
            <>
              <Button type="button" onClick={upload} disabled={pending}>
                {pending ? <Spinner className="text-cream" /> : "Upload photo"}
              </Button>
              <Button type="button" variant="ghost" onClick={cancel} disabled={pending}>
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              <Camera /> {photoUrl ? "Change photo" : "Add a photo"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
