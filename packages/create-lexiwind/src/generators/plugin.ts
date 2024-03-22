import { join } from "path";
import { writeFile } from '../utils/fs';
import type { Framework } from '../utils/detect';

export type GeneratePluginOptions = {
  pluginId: string;
  outputDir: string;
  framework: Framework;
};

export type GeneratedFile = {
  path: string;
};

export async function generatePlugin(opts: GeneratePluginOptions): Promise<GeneratedFile[]> {
  const { pluginId, outputDir, framework } = opts;
  const files: GeneratedFile[] = [];

  const write = (relativePath: string, content: string) => {
    const fullPath = join(outputDir, relativePath);
    writeFile(fullPath, content);
    files.push({ path: fullPath });
  };

  switch (pluginId) {
    case "toolbar": {
      const { generateToolbarTsx } = await import("../templates/plugins/toolbar.js");
      write("EditorToolbar.tsx", generateToolbarTsx({ framework }));
      break;
    }
    case "slash-command": {
      const { generateSlashCommandTsx } = await import("../templates/plugins/slash-command.js");
      write("plugins/SlashCommandPlugin.tsx", generateSlashCommandTsx({ framework }));
      break;
    }
    case "markdown": {
      const { generateMarkdownTsx } = await import("../templates/plugins/markdown.js");
      write("plugins/MarkdownPlugin.tsx", generateMarkdownTsx({ framework }));
      break;
    }
    case "table": {
      const { generateTableToolbarTsx } = await import("../templates/plugins/table.js");
      write("plugins/TableToolbar.tsx", generateTableToolbarTsx({ framework }));
      break;
    }
    case "collaboration": {
      const { generateCollaborationTsx } = await import("../templates/plugins/collaboration.js");
      write("plugins/CollaborationPlugin.tsx", generateCollaborationTsx({ framework }));
      break;
    }
    // images, links, code — no files generated, only instructions printed
  }

  return files;
}
