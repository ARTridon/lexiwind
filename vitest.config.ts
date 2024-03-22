import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsConfigPaths(), react()],
  resolve: {
    alias: {
      "@lexiwind/core": path.resolve(__dirname, "./packages/core/src/index.ts"),
      "@lexiwind/react": path.resolve(__dirname, "./packages/react/src/index.ts"),
      "@lexiwind/history": path.resolve(__dirname, "./packages/history/src/index.ts"),
      "@lexiwind/table": path.resolve(__dirname, "./packages/table/src/index.ts"),
      "@lexiwind/code": path.resolve(__dirname, "./packages/code/src/index.ts"),
      "@lexiwind/slash-command": path.resolve(
        __dirname,
        "./packages/slash-command/src/index.ts"
      ),
      "@lexiwind/toolbar": path.resolve(__dirname, "./packages/toolbar/src/index.ts"),
      "@lexiwind/mentions": path.resolve(__dirname, "./packages/mentions/src/index.ts"),
      "@lexiwind/collapsible": path.resolve(
        __dirname,
        "./packages/collapsible/src/index.ts"
      ),
      "@lexiwind/embeds": path.resolve(__dirname, "./packages/embeds/src/index.ts"),
      "@lexiwind/themes": path.resolve(__dirname, "./packages/themes/src/index.ts"),
    },
  },
  css: { postcss: { plugins: [] } },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/smoke/setup.ts"],
    include: ["tests/smoke/**/*.test.ts", "tests/smoke/**/*.test.tsx"],
    testTimeout: 10_000,
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
  },
});
