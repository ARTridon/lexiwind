import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $deleteTableColumn__EXPERIMENTAL,
  $deleteTableRow__EXPERIMENTAL,
  $insertTableColumn__EXPERIMENTAL,
  $insertTableRow__EXPERIMENTAL,
  $isTableCellNode,
  $isTableSelection,
} from "@lexical/table";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $createRangeSelection,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TableState {
  isInTable: boolean;
  insertRowAfter(): void;
  insertRowBefore(): void;
  insertColumnAfter(): void;
  insertColumnBefore(): void;
  deleteRow(): void;
  deleteColumn(): void;
}

/** All table cell operations in one hook. Only re-renders when isInTable toggles. */
export function useTableState(): TableState {
  const [editor] = useLexicalComposerContext();
  const [isInTable, setIsInTable] = useState(false);
  const cache = useRef<{
    anchorKey: string; anchorOffset: number; anchorType: "element" | "text";
    focusKey: string; focusOffset: number; focusType: "element" | "text";
  } | null>(null);

  const update = useCallback(() => {
    const sel = $getSelection();
    if ($isRangeSelection(sel)) {
      cache.current = {
        anchorKey: sel.anchor.key, anchorOffset: sel.anchor.offset, anchorType: sel.anchor.type as "element" | "text",
        focusKey: sel.focus.key, focusOffset: sel.focus.offset, focusType: sel.focus.type as "element" | "text",
      };
      setIsInTable($findMatchingParent(sel.anchor.getNode(), $isTableCellNode) !== null);
    } else if ($isTableSelection(sel)) {
      setIsInTable(true);
    } else {
      cache.current = null;
      setIsInTable(false);
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => editorState.read(update)),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => { update(); return false; }, 1)
    );
  }, [editor, update]);

  const tableAction = useCallback((fn: () => void) => {
    editor.update(() => {
      const sel = $getSelection();
      if ((!$isRangeSelection(sel) && !$isTableSelection(sel)) && cache.current) {
        const c = cache.current;
        const range = $createRangeSelection();
        range.anchor.set(c.anchorKey, c.anchorOffset, c.anchorType);
        range.focus.set(c.focusKey, c.focusOffset, c.focusType);
        $setSelection(range);
      }
      try { fn(); } catch { /* not in table */ }
    });
    queueMicrotask(() => editor.focus());
  }, [editor]);

  return {
    isInTable,
    insertRowAfter:    () => tableAction(() => $insertTableRow__EXPERIMENTAL(true)),
    insertRowBefore:   () => tableAction(() => $insertTableRow__EXPERIMENTAL(false)),
    insertColumnAfter:  () => tableAction(() => $insertTableColumn__EXPERIMENTAL(true)),
    insertColumnBefore: () => tableAction(() => $insertTableColumn__EXPERIMENTAL(false)),
    deleteRow:         () => tableAction(() => $deleteTableRow__EXPERIMENTAL()),
    deleteColumn:      () => tableAction(() => $deleteTableColumn__EXPERIMENTAL()),
  };
}
