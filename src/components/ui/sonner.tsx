"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

// App-wide toast container, styled to match the paper-and-oxblood palette.
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "16px",
          background: "var(--color-cream)",
          color: "var(--color-ink)",
          border: "1px solid rgba(62, 41, 36, 0.1)",
          fontFamily: "var(--font-sans)",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
