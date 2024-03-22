import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2020",
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "lexical",
    "@lexical/react",
    "@lexical/code",
    "@lexical/link",
    "@lexical/list",
    "@lexical/rich-text",
    "@lexiwind/core",
  ],
});
