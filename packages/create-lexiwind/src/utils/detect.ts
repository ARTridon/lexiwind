import { existsSync, readFileSync } from "fs";
import { join } from "path";

export type Framework = "vite" | "nextjs-app" | "nextjs-pages" | "react";

export function detectFramework(cwd: string = process.cwd()): Framework {
  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps["next"]) {
        if (existsSync(join(cwd, "app")) || existsSync(join(cwd, "src/app"))) {
          return "nextjs-app";
        }
        return "nextjs-pages";
      }
      if (deps["vite"] || deps["@vitejs/plugin-react"]) return "vite";
    } catch {
      // ignore parse errors
    }
  }
  if (existsSync(join(cwd, "next.config.js")) || existsSync(join(cwd, "next.config.ts"))) {
    return "nextjs-app";
  }
  if (existsSync(join(cwd, "vite.config.ts")) || existsSync(join(cwd, "vite.config.js"))) {
    return "vite";
  }
  return "react";
}

export function needsUseClient(framework: Framework): boolean {
  return framework === "nextjs-app";
}
