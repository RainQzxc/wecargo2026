"use client";

import { useEffect } from "react";
import { reportClientError } from "@/features/observability/actions";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError({
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      source: "global-error",
      route: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [error]);

  return (
    <html lang="mn">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f7f7f7" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 28,
              }}
            >
              !
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>
              Системийн алдаа
            </h1>
            <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px" }}>
              {error.message || "Системд алдаа гарлаа. Хуудсыг дахин ачааллана уу."}
            </p>
            {error.digest && (
              <p style={{ fontSize: 11, color: "#999", marginBottom: 16, fontFamily: "monospace" }}>
                {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: "10px 24px",
                background: "#06bbb4",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Дахин оролдох
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
