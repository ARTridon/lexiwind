import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $findMatchingParent } from "@lexical/utils";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";

export interface LinkState {
  isLink: boolean;
  /** Current URL of the link at the cursor, or "". */
  linkUrl: string;
  toggleLink(url: string | null): void;
}

/**
 * Tracks link state at the current selection.
 * Intentionally has no dependency on ToolbarPlugin or ToolbarContext —
 * it can be used standalone by the floating link editor.
 */
export function useLinkState(): LinkState {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const update = useCallback(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) {
      setIsLink(false);
      setLinkUrl("");
      return;
    }
    const anchorNode = sel.anchor.getNode();
    const linkParent = $findMatchingParent(anchorNode, $isLinkNode);
    if (linkParent) {
      setIsLink(true);
      setLinkUrl(linkParent.getURL());
    } else {
      setIsLink(false);
      setLinkUrl("");
    }
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

  const toggleLink = useCallback((url: string | null) => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    queueMicrotask(() => editor.focus());
  }, [editor]);

  return { isLink, linkUrl, toggleLink };
}
