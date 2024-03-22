import { Command } from "commander";
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { themeCommand } from './commands/theme';
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const pkg = require(join(dirname(fileURLToPath(import.meta.url)), "../package.json")) as {
  version: string;
};

const program = new Command();

program
  .name("create-lexiwind")
  .description("Scaffold production-ready Lexiwind editors")
  .version(pkg.version, "-v, --version");

// Default command: init (scaffold editor into existing project)
program
  .argument("[output-dir]", "Directory to generate the editor into")
  .description("Scaffold a Lexiwind editor into your project")
  .action(async (outputDir?: string) => {
    await initCommand(outputDir);
  });

// add <plugin>
program
  .command("add [plugin]")
  .description(
    [
      "Add a plugin to your editor",
      "",
      "  Available plugins:",
      "    toolbar          Formatting toolbar UI",
      "    slash-command    Type / to insert blocks",
      "    markdown         Markdown keyboard shortcuts",
      "    table            Table insert & edit toolbar",
      "    images           Image insert (built into lexiwind)",
      "    links            Floating link editor (built into lexiwind)",
      "    code             Code blocks (built into lexiwind)",
      "    collaboration    Real-time Yjs collaboration",
    ].join("\n")
  )
  .action(async (plugin?: string) => {
    await addCommand(plugin);
  });

// theme <name>
program
  .command("theme [name]")
  .description(
    [
      "Install a theme",
      "",
      "  Available themes:",
      "    tailwind   Tailwind CSS preset with editor utilities",
      "    shadcn     shadcn/ui CSS variables + editor theme object",
    ].join("\n")
  )
  .action(async (name?: string) => {
    await themeCommand(name);
  });

program.parseAsync(process.argv);
