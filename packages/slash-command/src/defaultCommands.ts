import { $createCodeNode } from "@lexical/code";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
} from "lexical";
import type { SlashCommandEntry } from "@lexiwind/core";

/**
 * Built-in slash commands for core block types.
 * Each command is individually exportable so you can include/exclude selectively.
 *
 * @example
 * ```tsx
 * // All defaults:
 * <SlashCommandRegistryProvider initial={defaultCommands(editor)} />
 *
 * // Without divider:
 * <SlashCommandRegistryProvider
 *   initial={defaultCommands(editor).filter(c => c.id !== "core:divider")}
 * />
 * ```
 */
export function defaultCommands(editor: LexicalEditor): SlashCommandEntry[] {
  return [
    {
      id: "core:paragraph",
      title: "Paragraph",
      icon: "¶",
      keywords: ["paragraph", "text", "p", "normal"],
      group: "Basic",
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel))
            $setBlocksType(sel, $createParagraphNode);
        }),
    },
    {
      id: "core:heading-1",
      title: "Heading 1",
      icon: "H1",
      keywords: ["h1", "heading", "title"],
      group: "Basic",
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel))
            $setBlocksType(sel, () => $createHeadingNode("h1"));
        }),
    },
    {
      id: "core:heading-2",
      title: "Heading 2",
      icon: "H2",
      keywords: ["h2", "heading", "subtitle"],
      group: "Basic",
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel))
            $setBlocksType(sel, () => $createHeadingNode("h2"));
        }),
    },
    {
      id: "core:heading-3",
      title: "Heading 3",
      icon: "H3",
      keywords: ["h3", "heading"],
      group: "Basic",
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel))
            $setBlocksType(sel, () => $createHeadingNode("h3"));
        }),
    },
    {
      id: "core:bullet-list",
      title: "Bullet List",
      icon: "•",
      keywords: ["ul", "unordered", "bullet", "list"],
      group: "List",
      onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    },
    {
      id: "core:numbered-list",
      title: "Numbered List",
      icon: "1.",
      keywords: ["ol", "ordered", "numbered", "list"],
      group: "List",
      onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    },
    {
      id: "core:check-list",
      title: "Check List",
      icon: "☑",
      keywords: ["todo", "task", "checkbox", "check"],
      group: "List",
      onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    },
    {
      id: "core:quote",
      title: "Quote",
      icon: "❝",
      keywords: ["quote", "blockquote"],
      group: "Basic",
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, $createQuoteNode);
        }),
    },
    {
      id: "core:code",
      title: "Code Block",
      icon: "</>",
      keywords: ["code", "pre", "block"],
      group: "Basic",
      onSelect: () =>
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) $setBlocksType(sel, $createCodeNode);
        }),
    },
    {
      id: "core:divider",
      title: "Divider",
      icon: "—",
      keywords: ["hr", "rule", "divider", "separator", "line"],
      group: "Basic",
      onSelect: () =>
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    },
  ];
}
