"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors in the root layout itself. It replaces the
 * whole document, so it can't rely on the layout's fonts, styles or components.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f8f3eb", color: "#3e2924" }}>
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div style={{ maxWidth: 420 }}>
            <h1 style={{ fontSize: 32, margin: "0 0 8px" }}>RaktoSheba is having trouble</h1>
            <p style={{ color: "#806b61", lineHeight: 1.6 }}>Something went wrong while loading the site. Please try again in a moment.</p>
            <button
              type="button"
              onClick={reset}
              style={{ marginTop: 20, border: 0, borderRadius: 999, background: "#a92836", color: "#fff9f1", padding: "12px 22px", fontWeight: 700, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
