import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enables forbidden() / unauthorized() interrupts used by the dashboard
    // auth guards in src/features/auth/dal.ts.
    authInterrupts: true,
  },
};

export default nextConfig;
