import * as p from "@clack/prompts";
import type { Framework } from '../utils/detect';

export type InitAnswers = {
  outputDir: string;
  framework: Framework;
  plugins: string[];
  theme: string;
};

export async function promptInit(
  projectName?: string,
  detectedFramework?: Framework
): Promise<InitAnswers> {
  let outputDir: string;

  if (projectName) {
    outputDir = projectName;
  } else {
    const result = await p.text({
      message: "Where should we generate your editor?",
      placeholder: "./src/components/editor",
      defaultValue: "./src/components/editor",
      validate: (v) => (v.trim() ? undefined : "Please enter a directory path"),
    });
    if (p.isCancel(result)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    outputDir = (result as string).trim();
  }

  const framework = (await p.select({
    message: "Which framework are you using?",
    initialValue: detectedFramework ?? "vite",
    options: [
      { value: "vite", label: "Vite + React" },
      { value: "nextjs-app", label: "Next.js (App Router)", hint: 'adds "use client"' },
      { value: "nextjs-pages", label: "Next.js (Pages Router)" },
      { value: "react", label: "React (custom setup)" },
    ],
  })) as Framework;

  if (p.isCancel(framework)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const plugins = (await p.multiselect({
    message: "Which plugins would you like to include?",
    options: [
      { value: "toolbar", label: "Toolbar", hint: "bold, italic, headings, lists" },
      { value: "slash-command", label: "Slash Commands", hint: "type / to insert blocks" },
      { value: "markdown", label: "Markdown Shortcuts", hint: "## heading, **bold**, etc." },
      { value: "table", label: "Tables", hint: "insert & edit tables" },
      { value: "images", label: "Images", hint: "already in lexiwind, adds usage note" },
    ],
    required: false,
  })) as string[];

  if (p.isCancel(plugins)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const theme = (await p.select({
    message: "Which theme would you like?",
    options: [
      { value: "none", label: "None", hint: "bring your own styles" },
      { value: "tailwind", label: "Tailwind CSS", hint: "generates a tailwind.preset.ts" },
      { value: "shadcn", label: "shadcn/ui", hint: "CSS variables + editor theme object" },
    ],
  })) as string;

  if (p.isCancel(theme)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  return { outputDir, framework, plugins, theme };
}
