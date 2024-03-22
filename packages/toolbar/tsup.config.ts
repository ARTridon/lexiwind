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
    "@lexical/utils",
    "@lexical/link",
    "@lexical/list",
    "@lexical/rich-text",
    "@lexical/selection",
    "@lexical/table",
    "@lexical/code",
    "@lexiwind/core",
  ],
});
