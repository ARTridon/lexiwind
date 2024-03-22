import { existsSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";

export function writeFile(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function resolveOutputPath(base: string, ...segments: string[]): string {
  return join(base, ...segments);
}
