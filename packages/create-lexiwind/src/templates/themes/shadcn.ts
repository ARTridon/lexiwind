export function generateShadcnTheme(): string {
  return `import type { EditorThemeClasses } from "lexical";

/**
 * Editor theme using shadcn/ui CSS variables.
 * Pass to your LexicalComposer initialConfig.theme, or via:
 *   <Lexiwind editorConfig={{ theme: editorTheme }}>
 */
export const editorTheme: EditorThemeClasses = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
  },
  paragraph: "mb-1 last:mb-0",
  heading: {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight mt-6 mb-2",
    h2: "scroll-m-20 text-3xl font-semibold tracking-tight mt-5 mb-2",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight mt-4 mb-1",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight mt-3 mb-1",
  },
  list: {
    ul: "ml-6 list-disc [&>li]:mt-1",
    ol: "ml-6 list-decimal [&>li]:mt-1",
    listitem: "leading-7",
    nested: { listitem: "list-none" },
    checklist: "ml-0",
    listitemChecked:
      "relative mx-2 px-6 list-none outline-none line-through before:absolute before:left-0 before:top-[3px] before:block before:h-4 before:w-4 before:cursor-pointer before:rounded-sm before:border before:border-primary before:bg-primary before:bg-[url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiBoZWlnaHQ9IjEyIiB3aWR0aD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDIuNUw0LjUgOCAyIDUuNSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)] before:bg-center before:bg-no-repeat",
    listitemUnchecked:
      "relative mx-2 px-6 list-none outline-none before:absolute before:left-0 before:top-[3px] before:block before:h-4 before:w-4 before:cursor-pointer before:rounded-sm before:border before:border-input",
  },
  quote:
    "my-4 border-l-4 border-border pl-4 italic text-muted-foreground [&>p]:leading-7",
  code: "my-4 block rounded-lg bg-muted p-4 font-mono text-sm leading-6",
  codeHighlight: {
    atrule: "text-blue-600 dark:text-blue-400",
    attr: "text-green-600 dark:text-green-400",
    boolean: "text-orange-600 dark:text-orange-400",
    builtin: "text-purple-600 dark:text-purple-400",
    cdata: "text-muted-foreground",
    char: "text-green-600 dark:text-green-400",
    class: "text-yellow-600 dark:text-yellow-400",
    "class-name": "text-yellow-600 dark:text-yellow-400",
    comment: "text-muted-foreground italic",
    constant: "text-orange-600 dark:text-orange-400",
    deleted: "text-red-600 dark:text-red-400",
    doctype: "text-muted-foreground",
    entity: "text-orange-600 dark:text-orange-400",
    function: "text-blue-600 dark:text-blue-400",
    important: "text-orange-600 dark:text-orange-400",
    inserted: "text-green-600 dark:text-green-400",
    keyword: "text-purple-600 dark:text-purple-400",
    namespace: "text-muted-foreground",
    number: "text-orange-600 dark:text-orange-400",
    operator: "text-foreground",
    prolog: "text-muted-foreground",
    property: "text-foreground",
    punctuation: "text-muted-foreground",
    regex: "text-green-600 dark:text-green-400",
    selector: "text-green-600 dark:text-green-400",
    string: "text-green-600 dark:text-green-400",
    symbol: "text-orange-600 dark:text-orange-400",
    tag: "text-red-600 dark:text-red-400",
    url: "text-blue-600 dark:text-blue-400",
    variable: "text-foreground",
  },
  link: "text-primary underline underline-offset-4 hover:opacity-80",
  hashtag: "text-blue-500",
  horizontalRule: "my-4 border-t border-border",
  table: "my-4 w-full border-collapse",
  tableCell: "border border-border px-3 py-2 text-sm",
  tableCellHeader:
    "border border-border bg-muted px-3 py-2 text-sm font-semibold",
};
`;
}

export function generateShadcnCss(): string {
  return `/* Editor base styles — imported alongside your global CSS */
.lexiwind-editor-inner {
  position: relative;
}

.lexiwind-editor-input {
  min-height: 150px;
  resize: vertical;
  outline: none;
  caret-color: currentColor;
  padding: 0.75rem 1rem;
}

.lexiwind-editor-placeholder {
  position: absolute;
  top: 0.75rem;
  left: 1rem;
  pointer-events: none;
  color: hsl(var(--muted-foreground));
  user-select: none;
}

/* Selection highlight */
.lexiwind-editor-input ::selection {
  background-color: hsl(var(--primary) / 0.15);
}
`;
}
