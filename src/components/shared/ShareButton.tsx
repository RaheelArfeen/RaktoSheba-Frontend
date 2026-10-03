"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Uses the native share sheet on phones, otherwise copies the link.
export default function ShareButton({ title, text }: { title: string; text: string }) {
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied. Share it with someone who can help.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return; // user closed the share sheet
      toast.error("Couldn't share this link. Try copying it from the address bar.");
    }
  };

  return (
    <Button variant="outline" onClick={share}>
      <Share2 /> Share request
    </Button>
  );
}
