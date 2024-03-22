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
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ToolbarPlugin } from "./plugins/ToolbarPlugin";

export type LexiwindPropsType = {
  value?: string;
  onChange?: (text: string) => void;
};

const editorConfig: InitialConfigType = {
  namespace: "React.js Demo",
  editable: true,
  nodes: [],
  onError(error: Error) {
    throw error;
  },
  theme: {
    ltr: "ltr",
    rtl: "rtl",
    code: "font-mono bg-gray-300  block py-2 px-2 md:px-8 md:py-2 md:pl-16 line-height-153 text-sm md:text-base md:leading-normal overflow-x-auto relative",
    heading: {
      h1: "text-3xl font-bold mb-4",
      h2: "text-2xl font-bold mb-3",
      h3: "text-xl font-bold mb-2",
      h4: "text-lg font-bold mb-2",
      h5: "text-base font-bold mb-1",
    },
    image: "editor-image",
    link: "editor-link",
    list: {
      listitem: "editor-listitem",
      nested: {
        listitem: "editor-nested-listitem",
      },
      ol: "editor-list-ol list-decimal ml-6",
      ul: "editor-list-ul list-disc ml-6",
    },
    paragraph: "editor-paragraph",
    placeholder: "editor-placeholder",
    quote: "editor-quote",
    text: {
      bold: "font-bold",
      code: "font-mono bg-gray-200 px-1 rounded",
      hashtag: "text-blue-500",
      italic: "italic",
      overflowed: "editor-text-overflowed",
      strikethrough: "line-through",
      underline: "underline",
      underlineStrikethrough: "underline line-through",
    },
  },
};

function Placeholder() {
  return (
    <div className="pointer-events-none absolute left-3 top-4 text-ellipsis text-sm text-gray-500">
      Enter some rich text...
    </div>
  );
}

export const Lexiwind = ({ value, onChange }: LexiwindPropsType) => {
  console.log(value, onChange);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="max-w-600 leading-20 relative mx-auto my-20 overflow-hidden rounded-md p-2 text-left font-normal text-black">
        <ToolbarPlugin />
        <div className="relative border bg-white">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
