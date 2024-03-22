export type Plugin = {
  id: string;
  name: string;
  description: string;
  packages: string[];
  generatesFiles: string[];
  integrationNote: string;
};

export const PLUGINS: Record<string, Plugin> = {
  toolbar: {
    id: "toolbar",
    name: "Toolbar",
    description: "Formatting toolbar with bold, italic, headings, lists, and more",
    packages: ["lexiwind"],
    generatesFiles: ["EditorToolbar.tsx"],
    integrationNote:
      'Wrap <ToolbarPlugin> around your <EditorToolbar /> inside <Lexiwind>.',
  },
  "slash-command": {
    id: "slash-command",
    name: "Slash Commands",
    description: "Type / to open a block picker — fully customizable",
    packages: ["lexiwind"],
    generatesFiles: ["plugins/SlashCommandPlugin.tsx"],
    integrationNote:
      "Place <SlashCommandPlugin /> inside <Lexiwind>. Remove the default ComponentPickerPlugin if you want full control.",
  },
  table: {
    id: "table",
    name: "Tables",
    description: "Insert and edit tables with row/column controls",
    packages: ["lexiwind", "@lexical/table"],
    generatesFiles: ["plugins/TableToolbar.tsx"],
    integrationNote:
      "Add TableNode, TableCellNode, TableRowNode to your editor config nodes. The <TablePlugin /> is included in lexiwind.",
  },
  images: {
    id: "images",
    name: "Images",
    description: "Insert, resize, and caption images",
    packages: ["lexiwind"],
    generatesFiles: [],
    integrationNote:
      "<ImagesPlugin /> and INSERT_IMAGE_COMMAND are exported from lexiwind — add them directly.",
  },
  markdown: {
    id: "markdown",
    name: "Markdown",
    description: "Markdown shortcuts (## heading, **bold**, etc.) and import/export",
    packages: ["@lexical/markdown"],
    generatesFiles: ["plugins/MarkdownPlugin.tsx"],
    integrationNote: "Place <MarkdownPlugin /> inside <Lexiwind>.",
  },
  links: {
    id: "links",
    name: "Links",
    description: "Link editing with a floating editor popup",
    packages: ["lexiwind"],
    generatesFiles: [],
    integrationNote:
      "FloatingLinkEditorPlugin is already included in lexiwind. Import TOGGLE_LINK_COMMAND to set links.",
  },
  code: {
    id: "code",
    name: "Code Blocks",
    description: "Syntax-highlighted code blocks with language selection",
    packages: ["lexiwind"],
    generatesFiles: [],
    integrationNote:
      "CodeHighlightPlugin is already included in lexiwind. Use /code slash command or FORMAT to code block.",
  },
  collaboration: {
    id: "collaboration",
    name: "Collaboration",
    description: "Real-time collaborative editing powered by Yjs",
    packages: ["@lexical/yjs", "yjs", "y-websocket"],
    generatesFiles: ["plugins/CollaborationPlugin.tsx"],
    integrationNote:
      "Provide a Y.Doc and WebSocket provider to <CollaborationPlugin />.",
  },
};

export function getPlugin(id: string): Plugin | undefined {
  return PLUGINS[id];
}

export function listPlugins(): Plugin[] {
  return Object.values(PLUGINS);
}
