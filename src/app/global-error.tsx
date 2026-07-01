"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Next.js redacts the real message in production, so `error.message` is
  // never shown to the user here — only the digest is a safe, stable reference.
  useEffect(() => {
    console.error("[global-error]", error.digest, error);
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
              Аппликейшн ачаалж чадсангүй
            </h1>
            <p style={{ color: "#666", fontSize: 14, margin: "0 0 16px", lineHeight: 1.6 }}>
              Уучлаарай, ноцтой алдаа гарсан тул хуудсыг харуулж чадсангүй. Доорх товчоор
              дахин оролдоно уу, эсвэл хуудсаа сэргээнэ үү.
            </p>
            {error.digest && (
              <div
                style={{
                  background: "#f0f0f0",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 16,
                  textAlign: "left",
                }}
              >
                <p style={{ fontSize: 10, color: "#999", margin: 0, textTransform: "uppercase" }}>
                  Алдааны код
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#333",
                    marginTop: 2,
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {error.digest}
                </p>
              </div>
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
