export type SlashCommandTemplateOptions = {
  framework: string;
};

export function generateSlashCommandTsx(opts: SlashCommandTemplateOptions): string {
  const useClient = opts.framework === "nextjs-app";
  const header = useClient ? '"use client";\n\n' : "";

  return (
    header +
    `import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "lexiwind";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createCodeNode } from "@lexical/code";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
  type TextNode,
} from "lexical";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

class SlashCommandOption extends MenuOption {
  title: string;
  icon: string;
  keywords: string[];
  onSelect: (query: string) => void;

  constructor(
    title: string,
    options: { icon: string; keywords?: string[]; onSelect: (query: string) => void }
  ) {
    super(title);
    this.title = title;
    this.icon = options.icon;
    this.keywords = options.keywords ?? [];
    this.onSelect = options.onSelect;
  }
}

function getCommands(editor: LexicalEditor): SlashCommandOption[] {
  return [
    new SlashCommandOption("Paragraph", {
      icon: "¶",
      keywords: ["paragraph", "text", "p"],
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, $createParagraphNode);
        }),
    }),
    new SlashCommandOption("Heading 1", {
      icon: "H1",
      keywords: ["h1", "heading", "title"],
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode("h1"));
        }),
    }),
    new SlashCommandOption("Heading 2", {
      icon: "H2",
      keywords: ["h2", "heading", "subtitle"],
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode("h2"));
        }),
    }),
    new SlashCommandOption("Heading 3", {
      icon: "H3",
      keywords: ["h3", "heading"],
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode("h3"));
        }),
    }),
    new SlashCommandOption("Bullet List", {
      icon: "•",
      keywords: ["ul", "unordered", "bullet", "list"],
      onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new SlashCommandOption("Numbered List", {
      icon: "1.",
      keywords: ["ol", "ordered", "numbered", "list"],
      onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new SlashCommandOption("Check List", {
      icon: "☑",
      keywords: ["todo", "task", "checkbox", "check"],
      onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new SlashCommandOption("Quote", {
      icon: "❝",
      keywords: ["quote", "blockquote"],
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, $createQuoteNode);
        }),
    }),
    new SlashCommandOption("Code Block", {
      icon: "</>",
      keywords: ["code", "pre", "block"],
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, $createCodeNode);
        }),
    }),
    new SlashCommandOption("Divider", {
      icon: "—",
      keywords: ["hr", "rule", "divider", "separator", "line"],
      onSelect: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
  ];
}

export default function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);

  const trigger = useBasicTypeaheadTriggerMatch("/", { minLength: 0, maxLength: 75 });

  const options = useMemo(() => {
    const cmds = getCommands(editor);
    if (!query) return cmds;
    const re = new RegExp(query.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&"), "i");
    return cmds.filter((o) => re.test(o.title) || o.keywords.some((k) => re.test(k)));
  }, [editor, query]);

  const onSelect = useCallback(
    (
      option: SlashCommandOption,
      nodeToRemove: TextNode | null,
      close: () => void
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        option.onSelect(query ?? "");
        close();
      });
    },
    [editor, query]
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashCommandOption>
      onQueryChange={setQuery}
      onSelectOption={onSelect}
      triggerFn={trigger}
      options={options}
      menuRenderFn={(
        anchorRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex, options: opts }
      ) => {
        if (!anchorRef.current || opts.length === 0) return null;
        return createPortal(
          <div
            role="listbox"
            className="absolute z-50 min-w-[200px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <div className="max-h-72 overflow-y-auto p-1">
              {opts.map((option, i) => (
                <button
                  key={option.key}
                  ref={(el) => option.setRefElement(el)}
                  role="option"
                  aria-selected={selectedIndex === i}
                  onClick={() => selectOptionAndCleanUp(option)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className={[
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-sm",
                    selectedIndex === i
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span className="w-8 text-center font-mono text-xs text-gray-400">
                    {option.icon}
                  </span>
                  <span>{option.title}</span>
                </button>
              ))}
            </div>
          </div>,
          anchorRef.current
        );
      }}
    />
  );
}
`
  );
}
