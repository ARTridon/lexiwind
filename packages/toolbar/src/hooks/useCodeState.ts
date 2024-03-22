import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isCodeNode, type CodeNode } from "@lexical/code";
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useCachedSelection } from './useCachedSelection';

export interface CodeState {
  /** Current language of the code block at the cursor, or "". */
  codeLanguage: string;
  setCodeLanguage(lang: string): void;
}

/** Tracks and updates the language of the code block under the cursor. */
export function useCodeState(): CodeState {
  const [editor] = useLexicalComposerContext();
  const { restoreAndRun } = useCachedSelection();
  const [codeLanguage, setCodeLanguageState] = useState("");

  const update = useCallback(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) { setCodeLanguageState(""); return; }
    try {
      const block = $getNearestBlockElementAncestorOrThrow(sel.anchor.getNode());
      setCodeLanguageState($isCodeNode(block) ? (block as CodeNode).getLanguage() ?? "" : "");
    } catch {
      setCodeLanguageState("");
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => editorState.read(update)),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => { update(); return false; }, 1)
    );
  }, [editor, update]);

  const setCodeLanguage = useCallback((lang: string) =>
    restoreAndRun(() => {
      const sel = $getSelection();
      if (!$isRangeSelection(sel)) return;
      try {
        const block = $getNearestBlockElementAncestorOrThrow(sel.anchor.getNode());
        if ($isCodeNode(block)) (block as CodeNode).setLanguage(lang);
      } catch { /* not in block */ }
    }),
    [restoreAndRun]
  );

  return { codeLanguage, setCodeLanguage };
}
