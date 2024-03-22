import type { Framework } from '../../utils/detect';

export function generateMarkdownTsx(opts: { framework: Framework }): string {
  const useClient = opts.framework === "nextjs-app";
  const directive = useClient ? '"use client";\n\n' : "";

  return `${directive}import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

/**
 * Enables markdown shortcuts in the editor.
 * Examples: ## heading, **bold**, _italic_, \`code\`, > quote, --- divider
 * Place inside <Lexiwind> alongside <RichTextPlugin />.
 */
export function MarkdownPlugin() {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
}
`;
}
