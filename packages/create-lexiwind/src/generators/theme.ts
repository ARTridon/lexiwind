import { join } from "path";
import { writeFile } from '../utils/fs';

export type GeneratedFile = {
  path: string;
};

export async function generateTheme(
  themeId: string,
  outputDir: string
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];

  const write = (relativePath: string, content: string) => {
    const fullPath = join(outputDir, relativePath);
    writeFile(fullPath, content);
    files.push({ path: fullPath });
  };

  if (themeId === "tailwind") {
    const { generateTailwindPreset } = await import("../templates/themes/tailwind.js");
    write("tailwind.preset.ts", generateTailwindPreset());
  } else if (themeId === "shadcn") {
    const { generateShadcnTheme, generateShadcnCss } = await import(
      "../templates/themes/shadcn.js"
    );
    write("themes/editor-theme.ts", generateShadcnTheme());
    write("themes/editor.css", generateShadcnCss());
  }

  return files;
}
