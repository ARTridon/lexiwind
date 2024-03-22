import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";

export interface UseHistoryResult {
  canUndo: boolean;
  canRedo: boolean;
  undo(): void;
  redo(): void;
}

/**
 * Tracks undo/redo availability and dispatches the corresponding commands.
 * Requires HistoryPlugin to be mounted in the same LexicalComposer tree.
 */
export function useHistory(): UseHistoryResult {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(CAN_UNDO_COMMAND, (v) => { setCanUndo(v); return false; }, 1),
      editor.registerCommand(CAN_REDO_COMMAND, (v) => { setCanRedo(v); return false; }, 1),
    );
  }, [editor]);

  const undo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  const redo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  return { canUndo, canRedo, undo, redo };
}
