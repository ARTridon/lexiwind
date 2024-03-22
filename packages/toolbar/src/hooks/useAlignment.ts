import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from "lexical";
import { useCallback } from "react";
import type { Alignment } from "@lexiwind/core";

export interface AlignmentState {
  align(direction: Alignment): void;
  indent(): void;
  outdent(): void;
}

/**
 * Alignment is not tracked as read state because Lexical doesn't expose
 * a reliable way to read element alignment from a range selection without
 * traversing to the block element. Use `useBlockType` and inspect block props
 * if you need to reflect current alignment in the UI.
 */
export function useAlignment(): AlignmentState {
  const [editor] = useLexicalComposerContext();

  const align = useCallback((direction: Alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, direction);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  const indent = useCallback(() => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  const outdent = useCallback(() => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  return { align, indent, outdent };
}
