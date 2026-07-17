import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    globals: true,

    include: [
      "src/**/*.test.ts",
      "src/**/*.spec.ts",
    ],

    setupFiles: [
      "./src/tests/setup.ts",
    ],

    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "html",
      ],

      include: [
        "src/**/*.ts",
      ],

      exclude: [
        "src/server.ts",
        "src/tests/**",
        "src/**/*.d.ts",
        "src/config/**",
        "src/lib/prisma.ts",
      ],
    },
  },
});