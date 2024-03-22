export function generateTailwindPreset(): string {
  return `import type { Config } from "tailwindcss";

/**
 * Lexiwind Tailwind preset.
 * Add to your tailwind.config.ts:
 *
 *   import { lexiwindPreset } from "./src/components/editor/tailwind.preset";
 *   export default { presets: [lexiwindPreset], ... }
 */
export const lexiwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        editor: {
          bg: "#ffffff",
          border: "#e5e7eb",
          toolbar: "#f9fafb",
          text: "#111827",
          muted: "#6b7280",
          selection: "#dbeafe",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "inherit",
            a: { color: "inherit" },
          },
        },
      },
    },
  },
  plugins: [],
};
`;
}
