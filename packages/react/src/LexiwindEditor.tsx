"use client";

import { ReactNode } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { UpdateStatePlugin } from "./UpdateStatePlugin";

export interface LexiwindEditorProps {
  /** Initial serialized editor state (JSON string). Applied once on mount. */
  defaultValue?: string;
  /** Controlled serialized editor state (JSON string). Synced on change. */
  value?: string;
  /** Called on every state change with the serialized editor state as a JSON string. */
  onChange?: (state: string) => void;
  /** Override or extend the Lexical initial config (nodes are merged, not replaced). */
  config?: Partial<InitialConfigType>;
  /** Plugins and UI mounted inside the LexicalComposer context. */
  children?: ReactNode;
  /** Editor namespace — defaults to "lexiwind". */
  namespace?: string;
}

const BASE_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  HorizontalRuleNode,
];

export function LexiwindEditor({
  defaultValue,
  value,
  onChange,
  config,
  children,
  namespace = "lexiwind",
}: LexiwindEditorProps) {
  const nodes = config?.nodes
    ? [...BASE_NODES, ...config.nodes]
    : BASE_NODES;

  const initialConfig: InitialConfigType = {
    namespace,
    onError: console.error,
    ...config,
    nodes,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {children}
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(_, editor) => {
          if (!onChange) return;
          onChange(JSON.stringify(editor.getEditorState().toJSON()));
        }}
      />
      {(value ?? defaultValue) != null && (
        <UpdateStatePlugin value={value ?? defaultValue} />
      )}
    </LexicalComposer>
  );
}
