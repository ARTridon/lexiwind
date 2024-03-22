import { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_CODE_COMMAND } from './CodePlugin';

export interface UseCodeBlockResult {
  insertCodeBlock(language?: string): void;
}

/**
 * Dispatches INSERT_CODE_COMMAND to insert a code block.
 * Requires CodePlugin and CodeNode registered in the same LexicalComposer tree.
 */
export function useCodeBlock(): UseCodeBlockResult {
  const [editor] = useLexicalComposerContext();

  const insertCodeBlock = useCallback(
    (language?: string) => {
      editor.dispatchCommand(INSERT_CODE_COMMAND, { language });
    },
    [editor]
  );

  return { insertCodeBlock };
}
