import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";

export interface FormatState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  toggleBold(): void;
  toggleItalic(): void;
  toggleUnderline(): void;
  toggleStrikethrough(): void;
  toggleCode(): void;
  clearFormatting(): void;
}

/**
 * Tracks inline format state (bold, italic, etc.) and exposes toggle actions.
 * Subscribe only to this hook if your toolbar only shows format buttons —
 * it won't re-render when block type or alignment changes.
 */
export function useFormatState(): FormatState {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const update = useCallback(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) return;
    setIsBold(sel.hasFormat("bold"));
    setIsItalic(sel.hasFormat("italic"));
    setIsUnderline(sel.hasFormat("underline"));
    setIsStrikethrough(sel.hasFormat("strikethrough"));
    setIsCode(sel.hasFormat("code"));
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

  const clearFormatting = useCallback(() => {
    const active: Array<"bold" | "italic" | "underline" | "strikethrough" | "code"> = [];
    editor.update(() => {
      const sel = $getSelection();
      if (!$isRangeSelection(sel)) return;
      if (sel.hasFormat("bold")) active.push("bold");
      if (sel.hasFormat("italic")) active.push("italic");
      if (sel.hasFormat("underline")) active.push("underline");
      if (sel.hasFormat("strikethrough")) active.push("strikethrough");
      if (sel.hasFormat("code")) active.push("code");
      $patchStyleText(sel, {
        color: null,
        "font-size": null,
        "font-family": null,
        "background-color": null,
      });
    });
    queueMicrotask(() => {
      active.forEach((fmt) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, fmt));
      editor.focus();
    });
  }, [editor]);

  return {
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isCode,
    toggleBold:          () => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");          queueMicrotask(() => editor.focus()); },
    toggleItalic:        () => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");        queueMicrotask(() => editor.focus()); },
    toggleUnderline:     () => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");     queueMicrotask(() => editor.focus()); },
    toggleStrikethrough: () => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"); queueMicrotask(() => editor.focus()); },
    toggleCode:          () => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");          queueMicrotask(() => editor.focus()); },
    clearFormatting,
  };
}
