import * as p from "@clack/prompts";
import { listPlugins } from '../registry/plugins';

export type AddAnswers = {
  pluginId: string;
  outputDir: string;
};

export async function promptAdd(pluginId?: string): Promise<AddAnswers> {
  let id: string;

  if (pluginId) {
    id = pluginId;
  } else {
    const selected = await p.select({
      message: "Which plugin would you like to add?",
      options: listPlugins().map((plugin) => ({
        value: plugin.id,
        label: plugin.name,
        hint: plugin.description,
      })),
    });
    if (p.isCancel(selected)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    id = selected as string;
  }

  const outputDir = await p.text({
    message: "Where is your editor directory?",
    placeholder: "./src/components/editor",
    defaultValue: "./src/components/editor",
    validate: (v) => (v.trim() ? undefined : "Please enter a directory path"),
  });

  if (p.isCancel(outputDir)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  return { pluginId: id, outputDir: (outputDir as string).trim() };
}
