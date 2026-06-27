import type { NextConfig } from "next";

/**
 * Baseline security response headers applied to every route. These are the
 * low-risk, high-value headers that don't require per-request nonces. A full
 * Content-Security-Policy is deliberately left out here because it needs a
 * nonce-based setup in the proxy to avoid breaking inline styles/scripts — see
 * the CSP guide in the Next docs before adding one.
 */
const securityHeaders = [
  // Force HTTPS for two years, including subdomains. Safe once the site is
  // served over TLS; ignored over plain HTTP.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Stop browsers from MIME-sniffing responses away from the declared type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow framing to mitigate clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  // Don't leak full URLs (which may carry IDs) to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Drop powerful browser features this app does not use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version.
  poweredByHeader: false,

  experimental: {
    // Enables forbidden() / unauthorized() interrupts used by the dashboard
    // auth guards in src/features/auth/dal.ts.
    authInterrupts: true,
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
