"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface Props {
  value: string | undefined;
}

export function UpdateStatePlugin({ value }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) return;
    try {
      const parsed = JSON.parse(value);
      const state = editor.parseEditorState(parsed);
      if (!state.isEmpty()) {
        editor.setEditorState(state);
      }
    } catch {
      // ignore malformed state
    }
  }, [editor, value]);

  return null;
}
