import { existsSync } from "fs";
import { join } from "path";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  if (existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installCommand(pm: PackageManager, packages: string[], dev = false): string {
  const flag = dev ? (pm === "npm" ? " --save-dev" : " -D") : "";
  const pkgs = packages.join(" ");
  switch (pm) {
    case "bun":
      return `bun add${flag} ${pkgs}`;
    case "pnpm":
      return `pnpm add${flag} ${pkgs}`;
    case "yarn":
      return `yarn add${flag} ${pkgs}`;
    default:
      return `npm install${flag} ${pkgs}`;
  }
}
