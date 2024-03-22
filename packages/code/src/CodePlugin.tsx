"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import { $createCodeNode, CodeNode } from "@lexical/code";

export const INSERT_CODE_COMMAND: LexicalCommand<{ language?: string }> =
  createCommand("INSERT_CODE_COMMAND");

export interface CodePluginProps {
  defaultLanguage?: string;
}

/**
 * Code block plugin. Registers INSERT_CODE_COMMAND and validates CodeNode
 * is registered in the editor config.
 *
 * Register CodeNode before use:
 * ```ts
 * nodes: [CodeNode, ...]
 * ```
 */
export function CodePlugin({ defaultLanguage = "javascript" }: CodePluginProps = {}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CodeNode])) {
      throw new Error("CodePlugin: CodeNode is not registered. Add it to your editor config.nodes.");
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_CODE_COMMAND,
        ({ language = defaultLanguage }) => {
          const node = $createCodeNode(language);
          $insertNodeToNearestRoot(node);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, defaultLanguage]);

  return null;
}
