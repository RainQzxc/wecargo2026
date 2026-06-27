import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // Project path alias, mirrors tsconfig "paths".
      "@": r("./src"),
      // `server-only` is a Next.js build-time marker with no runtime module.
      // Stub it so server modules can be imported under Node/Vitest.
      "server-only": r("./test/stubs/empty-module.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/features/auth/**", "src/proxy.ts"],
      reporter: ["text", "html"],
    },
  },
});
