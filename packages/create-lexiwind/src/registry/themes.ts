export type Theme = {
  id: string;
  name: string;
  description: string;
  packages: string[];
  generatesFiles: string[];
};

export const THEMES: Record<string, Theme> = {
  tailwind: {
    id: "tailwind",
    name: "Tailwind CSS",
    description: "Tailwind preset with Lexiwind utilities and typography",
    packages: ["tailwindcss"],
    generatesFiles: ["tailwind.preset.ts"],
  },
  shadcn: {
    id: "shadcn",
    name: "shadcn/ui",
    description: "CSS-variable-based theme that integrates with shadcn/ui",
    packages: ["tailwindcss", "class-variance-authority", "clsx", "tailwind-merge"],
    generatesFiles: ["themes/editor-theme.ts", "themes/editor.css"],
  },
};

export function getTheme(id: string): Theme | undefined {
  return THEMES[id];
}

export function listThemes(): Theme[] {
  return Object.values(THEMES);
}
