import type { Framework } from '../../utils/detect';

export type EditorTemplateOptions = {
  framework: Framework;
  plugins: string[];
};

export function generateEditorTsx(opts: EditorTemplateOptions): string {
  const { framework, plugins } = opts;
  const useClient = framework === "nextjs-app";
  const hasToolbar = plugins.includes("toolbar");
  const hasSlash = plugins.includes("slash-command");
  const hasMarkdown = plugins.includes("markdown");

  const lines: string[] = [];

  if (useClient) lines.push('"use client";\n');

  const lexiwindImports = ["Lexiwind", "RichTextPlugin", hasToolbar ? "ToolbarPlugin" : null]
    .filter(Boolean)
    .join(", ");

  lines.push(`import { ${lexiwindImports} } from "lexiwind";`);
  if (hasToolbar) lines.push(`import { EditorToolbar } from "./EditorToolbar";`);
  if (hasSlash) lines.push(`import SlashCommandPlugin from "./plugins/SlashCommandPlugin";`);
  if (hasMarkdown) lines.push(`import { MarkdownPlugin } from "./plugins/MarkdownPlugin";`);
  lines.push("");
  lines.push("interface EditorProps {");
  lines.push("  value?: string;");
  lines.push("  onChange?: (value: string) => void;");
  lines.push("  placeholder?: string;");
  lines.push("}");
  lines.push("");
  lines.push("export function Editor({ value, onChange, placeholder }: EditorProps) {");
  lines.push("  return (");
  lines.push("    <Lexiwind value={value} onChange={onChange}>");

  if (hasToolbar) {
    lines.push(
      '      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">'
    );
    lines.push("        <ToolbarPlugin>");
    lines.push("          <EditorToolbar />");
    lines.push("        </ToolbarPlugin>");
    lines.push('        <div className="px-4 py-3">');
    lines.push('          <RichTextPlugin placeholder={placeholder ?? "Start writing..."} />');
    lines.push("        </div>");
    lines.push("      </div>");
  } else {
    lines.push(
      '      <div className="relative min-h-[150px] rounded-xl border border-gray-200 bg-white px-4 py-3">'
    );
    lines.push('        <RichTextPlugin placeholder={placeholder ?? "Start writing..."} />');
    lines.push("      </div>");
  }

  if (hasSlash) lines.push("      <SlashCommandPlugin />");
  if (hasMarkdown) lines.push("      <MarkdownPlugin />");

  lines.push("    </Lexiwind>");
  lines.push("  );");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

export function generateEditorIndex(useClient: boolean): string {
  const directive = useClient ? '"use client";\n\n' : "";
  return `${directive}export { Editor } from "./Editor";\n`;
}
