import * as p from "@clack/prompts";
import pc from "picocolors";
import { getTheme, listThemes } from '../registry/themes';
import { generateTheme } from '../generators/theme';
import { detectPackageManager, installCommand } from '../utils/packages';

export async function themeCommand(themeId?: string): Promise<void> {
  p.intro(pc.bold("  Lexiwind ✦  Install a theme"));

  let id = themeId;

  if (!id) {
    const selected = await p.select({
      message: "Which theme would you like to install?",
      options: listThemes().map((t) => ({
        value: t.id,
        label: t.name,
        hint: t.description,
      })),
    });
    if (p.isCancel(selected)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    id = selected as string;
  }

  const theme = getTheme(id);
  if (!theme) {
    console.error(pc.red(`Unknown theme: "${id}"`));
    console.error(pc.gray("Available: tailwind, shadcn"));
    process.exit(1);
  }

  const outputDir = await p.text({
    message: "Where should we generate the theme files?",
    placeholder: "./src/components/editor",
    defaultValue: "./src/components/editor",
    validate: (v) => (v.trim() ? undefined : "Please enter a directory path"),
  });

  if (p.isCancel(outputDir)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const s = p.spinner();
  s.start(`Generating ${theme.name} theme...`);

  let files: { path: string }[] = [];
  try {
    files = await generateTheme(id, (outputDir as string).trim());
  } catch (err) {
    s.stop("Failed.");
    console.error(pc.red(String(err)));
    process.exit(1);
  }

  s.stop(pc.green(`Created ${files.length} file${files.length !== 1 ? "s" : ""}`));

  for (const file of files) {
    console.log("  " + pc.green("✓") + " " + pc.gray(file.path));
  }

  const pm = detectPackageManager();
  const extraPkgs = theme.packages.filter((p) => p !== "lexiwind");
  const steps: string[] = [];

  if (extraPkgs.length > 0) {
    steps.push(`Install: ${pc.cyan(installCommand(pm, extraPkgs))}`);
  }

  if (id === "tailwind") {
    steps.push(
      `Config:  ${pc.cyan('import { lexiwindPreset } from "./tailwind.preset"')}`,
      `         ${pc.cyan("// Add to tailwind.config.ts: presets: [lexiwindPreset]")}`
    );
  } else if (id === "shadcn") {
    steps.push(
      `Import:  ${pc.cyan('import { editorTheme } from "./themes/editor-theme"')}`,
      `         ${pc.cyan('import "./themes/editor.css"')}`,
      `Use:     ${pc.cyan("<Lexiwind editorConfig={{ theme: editorTheme }}>")}`
    );
  }

  if (steps.length > 0) {
    console.log();
    p.note(steps.join("\n"), "Next steps");
  }

  p.outro(pc.green("Theme installed!"));
}
