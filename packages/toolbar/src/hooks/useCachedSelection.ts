import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createRangeSelection,
  $getSelection,
  $isRangeSelection,
  $setSelection,
} from "lexical";
import { useCallback, useEffect, useRef } from "react";

interface CachedPoint {
  key: string;
  offset: number;
  type: "element" | "text";
}

interface CachedSelection {
  anchor: CachedPoint;
  focus: CachedPoint;
}

/**
 * Tracks the last known RangeSelection so toolbar actions can restore it
 * after toolbar button clicks steal focus from the editor.
 *
 * Usage: call restoreAndRun(fn) instead of editor.update(fn) from toolbar handlers.
 */
export function useCachedSelection() {
  const [editor] = useLexicalComposerContext();
  const cache = useRef<CachedSelection | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          cache.current = {
            anchor: {
              key: sel.anchor.key,
              offset: sel.anchor.offset,
              type: sel.anchor.type as "element" | "text",
            },
            focus: {
              key: sel.focus.key,
              offset: sel.focus.offset,
              type: sel.focus.type as "element" | "text",
            },
          };
        } else {
          cache.current = null;
        }
      });
    });
  }, [editor]);

  /**
   * Runs `fn` inside editor.update(), restoring the cached selection first if
   * the current selection is empty (e.g. after a toolbar button steals focus).
   */
  const restoreAndRun = useCallback(
    (fn: () => void) => {
      editor.update(() => {
        const sel = $getSelection();
        if (!$isRangeSelection(sel) && cache.current) {
          const c = cache.current;
          const range = $createRangeSelection();
          range.anchor.set(c.anchor.key, c.anchor.offset, c.anchor.type);
          range.focus.set(c.focus.key, c.focus.offset, c.focus.type);
          $setSelection(range);
        }
        fn();
      });
      queueMicrotask(() => editor.focus());
    },
    [editor]
  );

  return { restoreAndRun, cache };
}
