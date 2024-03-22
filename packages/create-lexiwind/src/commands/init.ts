import * as p from "@clack/prompts";
import pc from "picocolors";
import { promptInit } from '../prompts/init';
import { generateProject } from '../generators/project';
import { detectFramework } from '../utils/detect';
import { detectPackageManager, installCommand } from '../utils/packages';

export async function initCommand(projectName?: string): Promise<void> {
  p.intro(pc.bold("  Lexiwind ✦  Create your editor"));

  const detected = detectFramework();
  const answers = await promptInit(projectName, detected);

  const s = p.spinner();
  s.start("Generating files...");

  let files: { path: string }[] = [];
  try {
    files = await generateProject({
      outputDir: answers.outputDir,
      framework: answers.framework,
      plugins: answers.plugins,
      theme: answers.theme,
    });
  } catch (err) {
    s.stop("Failed to generate files.");
    console.error(pc.red(String(err)));
    process.exit(1);
  }

  s.stop(pc.green(`Created ${files.length} file${files.length !== 1 ? "s" : ""}`));

  for (const file of files) {
    console.log("  " + pc.green("✓") + " " + pc.gray(file.path));
  }

  const pm = detectPackageManager();
  const needsPackages = ["lexiwind"];
  if (answers.plugins.includes("markdown")) needsPackages.push("@lexical/markdown");
  if (answers.plugins.includes("collaboration"))
    needsPackages.push("@lexical/yjs", "yjs", "y-websocket");

  const steps: string[] = [
    `Install: ${pc.cyan(installCommand(pm, [...new Set(needsPackages)]))}`,
    `Import:  ${pc.cyan(`import { Editor } from "${answers.outputDir}"`)}`,
    `Use:     ${pc.cyan('<Editor value={content} onChange={setContent} />')}`,
  ];

  if (answers.plugins.includes("table")) {
    steps.push(
      `Tables:  Add TableNode, TableCellNode, TableRowNode to your editorConfig.nodes`
    );
  }

  console.log();
  p.note(steps.join("\n"), "Next steps");
  p.outro(pc.green("Happy editing!"));
}
