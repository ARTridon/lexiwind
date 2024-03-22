import { join } from "path";
import { writeFile } from '../utils/fs';
import { generateEditorTsx, generateEditorIndex } from '../templates/editors/base';
import { generateToolbarTsx } from '../templates/plugins/toolbar';
import { generateSlashCommandTsx } from '../templates/plugins/slash-command';
import { generateMarkdownTsx } from '../templates/plugins/markdown';
import { generateTableToolbarTsx } from '../templates/plugins/table';
import type { Framework } from '../utils/detect';

export type GenerateProjectOptions = {
  outputDir: string;
  framework: Framework;
  plugins: string[];
  theme: string;
};

export type GeneratedFile = {
  path: string;
};

export async function generateProject(opts: GenerateProjectOptions): Promise<GeneratedFile[]> {
  const { outputDir, framework, plugins, theme } = opts;
  const files: GeneratedFile[] = [];
  const useClient = framework === "nextjs-app";

  const write = (relativePath: string, content: string) => {
    const fullPath = join(outputDir, relativePath);
    writeFile(fullPath, content);
    files.push({ path: fullPath });
  };

  // Core editor
  write("Editor.tsx", generateEditorTsx({ framework, plugins }));
  write("index.ts", generateEditorIndex(useClient));

  // Plugin files
  if (plugins.includes("toolbar")) {
    write("EditorToolbar.tsx", generateToolbarTsx({ framework }));
  }
  if (plugins.includes("slash-command")) {
    write("plugins/SlashCommandPlugin.tsx", generateSlashCommandTsx({ framework }));
  }
  if (plugins.includes("markdown")) {
    write("plugins/MarkdownPlugin.tsx", generateMarkdownTsx({ framework }));
  }
  if (plugins.includes("table")) {
    write("plugins/TableToolbar.tsx", generateTableToolbarTsx({ framework }));
  }

  // Theme files
  if (theme === "tailwind") {
    const { generateTailwindPreset } = await import("../templates/themes/tailwind.js");
    write("tailwind.preset.ts", generateTailwindPreset());
  } else if (theme === "shadcn") {
    const { generateShadcnTheme, generateShadcnCss } = await import(
      "../templates/themes/shadcn.js"
    );
    write("themes/editor-theme.ts", generateShadcnTheme());
    write("themes/editor.css", generateShadcnCss());
  }

  return files;
}
