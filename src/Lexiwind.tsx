/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
"use client";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@/plugins/RichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ToolbarPlugin } from "@/plugins/ToolbarPlugin";
import { TreeViewPlugin } from "@/plugins/TreeViewPlugin";
import { UpdateStatePlugin } from "@/plugins/UpdateStatePlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { cn } from "@/utils/cn";
import { ReactNode, useState } from "react";
import "./style.css";

export type LexiwindPropsType = {
  defaultValue?: string;
  value?: string;
  onChange?: (editorState: string) => void;
  placeholder?: string;
  editorConfig?: InitialConfigType;
  classNames?: {
    container?: string;
    contentEditable?: string;
    inner?: string;
    input?: string;
  };
  treeViewLog?: boolean;
  preview?: boolean;
  children?: ReactNode;
};

export const Lexiwind = ({
  defaultValue,
  value,
  onChange,
  placeholder,
  editorConfig,
  classNames,
  treeViewLog,
  preview,
  children,
}: LexiwindPropsType) => {
  const [config] = useState(
    () =>
      editorConfig ?? {
        namespace: "lexiwind-editor",
        onError: console.error,
        editable: !preview,
        code: "editor-code",
        heading: {
          h1: "editor-heading-h1",
          h2: "editor-heading-h2",
          h3: "editor-heading-h3",
          h4: "editor-heading-h4",
          h5: "editor-heading-h5",
        },
        image: "editor-image",
        link: "editor-link",
        list: {
          listitem: "editor-listitem",
          nested: {
            listitem: "editor-nested-listitem",
          },
          ol: "editor-list-ol",
          ul: "editor-list-ul",
        },
        ltr: "lexiwind-ltr",
        rtl: "lexiwind-rtl",
        paragraph: "lexiwind-m-0 lexiwind-mb-2 editor-relative",
        placeholder: "editor-placeholder",
        quote: "editor-quote",
        text: {
          bold: "lexiwind-font-bold",
          code: "lexiwind-bg-white lexiwind-text-[94%] lexiwind-px-1 lexiwind-py-[1px] font-['Menlo, Consolas, Monaco, monospace']",
          hashtag: "editor-text-hashtag",
          italic: "lexiwind-italic",
          overflowed: "editor-text-overflowed",
          strikethrough: "lexiwind-line-through",
          underline: "lexiwind-underline lexwind-underline-offset-1",
          underlineStrikethrough: "lexiwind-line-through",
        },
      },
  );

  return (
    <LexicalComposer initialConfig={config}>
      {children ? (
        children
      ) : (
        <div
          className={cn(
            classNames?.container ?? preview
              ? "lexiwind-max-w-3xl lexiwind-bg-white lexiwind-p-4"
              : "lexiwind-border-1 lexiwind-mx-auto lexiwind-max-w-3xl lexiwind-rounded-lg lexiwind-bg-white lexiwind-p-4 lexiwind-shadow-md",
          )}
        >
          {!preview && <ToolbarPlugin />}
          <div
            className={cn(
              classNames?.inner ? classNames?.inner : "editor-inner",
            )}
          >
            <RichTextPlugin classNames={classNames} placeholder={placeholder} />
          </div>
        </div>
      )}
      <HorizontalRulePlugin />
      <OnChangePlugin
        onChange={(_, editor) => {
          const editorState = editor.getEditorState().toJSON();
          const jsonString = JSON.stringify(editorState);
          onChange && onChange(jsonString);
        }}
      />
      {!preview && <AutoFocusPlugin />}
      {!!treeViewLog && <TreeViewPlugin />}
      <HistoryPlugin />
      {(!!value || !!defaultValue) && (
        <UpdateStatePlugin value={value ?? defaultValue} />
      )}
    </LexicalComposer>
  );
};
