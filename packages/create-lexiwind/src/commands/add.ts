import * as p from "@clack/prompts";
import pc from "picocolors";
import { getPlugin } from '../registry/plugins';
import { promptAdd } from '../prompts/add';
import { generatePlugin } from '../generators/plugin';
import { detectFramework } from '../utils/detect';
import { detectPackageManager, installCommand } from '../utils/packages';

export async function addCommand(pluginId?: string): Promise<void> {
  p.intro(pc.bold("  Lexiwind ✦  Add a plugin"));

  const answers = await promptAdd(pluginId);
  const plugin = getPlugin(answers.pluginId);

  if (!plugin) {
    console.error(pc.red(`Unknown plugin: "${answers.pluginId}"`));
    console.error(
      pc.gray(
        "Available: toolbar, slash-command, markdown, table, images, links, code, collaboration"
      )
    );
    process.exit(1);
  }

  const framework = detectFramework();

  const s = p.spinner();
  s.start(`Adding ${plugin.name}...`);

  let files: { path: string }[] = [];
  try {
    files = await generatePlugin({
      pluginId: answers.pluginId,
      outputDir: answers.outputDir,
      framework,
    });
  } catch (err) {
    s.stop("Failed.");
    console.error(pc.red(String(err)));
    process.exit(1);
  }

  if (files.length > 0) {
    s.stop(pc.green(`Created ${files.length} file${files.length !== 1 ? "s" : ""}`));
    for (const file of files) {
      console.log("  " + pc.green("✓") + " " + pc.gray(file.path));
    }
  } else {
    s.stop(pc.green(`${plugin.name} is ready to use`));
  }

  const pm = detectPackageManager();
  const extraPkgs = plugin.packages.filter((pkg) => pkg !== "lexiwind");
  const steps: string[] = [];

  if (extraPkgs.length > 0) {
    steps.push(`Install: ${pc.cyan(installCommand(pm, extraPkgs))}`);
  }
  if (plugin.integrationNote) {
    steps.push(`Usage:   ${pc.cyan(plugin.integrationNote)}`);
  }

  if (steps.length > 0) {
    console.log();
    p.note(steps.join("\n"), "Next steps");
  }

  p.outro(pc.green("Done!"));
}
