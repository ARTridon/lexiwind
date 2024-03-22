import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useCachedSelection } from './useCachedSelection';

export interface FontStyleState {
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
  setFontFamily(v: string): void;
  setFontSize(v: string): void;
  setFontColor(v: string): void;
  setBackgroundColor(v: string): void;
}

/** Reads and writes CSS font/color properties on the current selection. */
export function useFontStyle(): FontStyleState {
  const [editor] = useLexicalComposerContext();
  const { restoreAndRun } = useCachedSelection();

  const [fontFamily, setFontFamilyState] = useState("");
  const [fontSize, setFontSizeState] = useState("");
  const [fontColor, setFontColorState] = useState("");
  const [backgroundColor, setBackgroundColorState] = useState("");

  const update = useCallback(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) {
      setFontFamilyState(""); setFontSizeState("");
      setFontColorState(""); setBackgroundColorState("");
      return;
    }
    setFontFamilyState($getSelectionStyleValueForProperty(sel, "font-family", ""));
    setFontSizeState($getSelectionStyleValueForProperty(sel, "font-size", ""));
    setFontColorState($getSelectionStyleValueForProperty(sel, "color", ""));
    setBackgroundColorState($getSelectionStyleValueForProperty(sel, "background-color", ""));
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => editorState.read(update)),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => { update(); return false; }, 1)
    );
  }, [editor, update]);

  const patch = useCallback((styles: Record<string, string | null>) =>
    restoreAndRun(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $patchStyleText(sel, styles);
    }),
    [restoreAndRun]
  );

  return {
    fontFamily, fontSize, fontColor, backgroundColor,
    setFontFamily:      (v) => patch({ "font-family": v || null }),
    setFontSize:        (v) => patch({ "font-size": v || null }),
    setFontColor:       (v) => patch({ color: v || null }),
    setBackgroundColor: (v) => patch({ "background-color": v || null }),
  };
}
