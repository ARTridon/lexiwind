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
    "react-dom",
    "lexical",
    "@lexical/react",
    "@lexical/utils",
    "@lexical/code",
    "@lexical/list",
    "@lexical/rich-text",
    "@lexical/selection",
    "@lexiwind/core",
  ],
});
