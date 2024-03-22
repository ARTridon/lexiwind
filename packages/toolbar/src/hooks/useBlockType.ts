import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListItemNode,
  $isListNode,
} from "@lexical/list";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import { mergeRegister } from "@lexical/utils";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useCachedSelection } from './useCachedSelection';
import type { BlockType, HeadingTag } from "@lexiwind/core";

export interface BlockTypeState {
  blockType: BlockType;
  formatParagraph(): void;
  formatHeading(tag: HeadingTag): void;
  formatBulletList(): void;
  formatNumberedList(): void;
  formatCheckList(): void;
  formatQuote(): void;
  formatCode(): void;
}

function $readBlockType(): BlockType {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return "paragraph";
  const anchorNode = selection.anchor.getNode();
  try {
    const block = $getNearestBlockElementAncestorOrThrow(anchorNode);
    if ($isHeadingNode(block)) {
      const tag = block.getTag();
      if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6")
        return tag;
    }
    if ($isQuoteNode(block)) return "quote";
    if ($isCodeNode(block)) return "code";
    if ($isListItemNode(block)) {
      const parent = block.getParent();
      if (parent && $isListNode(parent)) {
        const t = parent.getListType();
        if (t === "number" || t === "bullet" || t === "check") return t;
      }
      return "bullet";
    }
    if ($isParagraphNode(block)) return "paragraph";
  } catch {
    // node not in block context
  }
  return "paragraph";
}

/**
 * Tracks the current block type and exposes format actions.
 * Isolated from inline formatting — won't re-render when bold/italic toggles.
 */
export function useBlockType(): BlockTypeState {
  const [editor] = useLexicalComposerContext();
  const { restoreAndRun } = useCachedSelection();
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const update = useCallback(() => {
    setBlockType($readBlockType());
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) =>
        editorState.read(update)
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => { update(); return false; },
        1
      )
    );
  }, [editor, update]);

  const formatParagraph = useCallback(() =>
    restoreAndRun(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $setBlocksType(sel, $createParagraphNode);
    }),
    [restoreAndRun]
  );

  const formatHeading = useCallback((tag: HeadingTag) =>
    restoreAndRun(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode(tag));
    }),
    [restoreAndRun]
  );

  const formatQuote = useCallback(() =>
    restoreAndRun(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $setBlocksType(sel, $createQuoteNode);
    }),
    [restoreAndRun]
  );

  const formatCode = useCallback(() =>
    restoreAndRun(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $setBlocksType(sel, $createCodeNode);
    }),
    [restoreAndRun]
  );

  const formatBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  const formatNumberedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  const formatCheckList = useCallback(() => {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  return {
    blockType,
    formatParagraph,
    formatHeading,
    formatBulletList,
    formatNumberedList,
    formatCheckList,
    formatQuote,
    formatCode,
  };
}
