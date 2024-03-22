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
import "./index.css";

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
    ltr: "lexiwind-ltr",
    rtl: "lexiwind-rtl",
    code: "lexiwind-font-mono lexiwind-bg-gray-300  lexiwind-block lexiwind-py-2 lexiwind-px-2 md:lexiwind-px-8 md:lexiwind-py-2 md:lexiwind-pl-16 lexiwind-line-height-[154px] lexiwind-text-sm md:lexiwind-text-base md:lexiwind-leading-normal lexiwind-overflow-x-auto lexiwind-relative",
    heading: {
      h1: "lexiwind-text-3xl lexiwind-font-bold lexiwind-mb-4",
      h2: "lexiwind-text-2xl lexiwind-font-bold lexiwind-mb-3",
      h3: "lexiwind-text-xl lexiwind-font-bold lexiwind-mb-2",
      h4: "lexiwind-text-lg lexiwind-font-bold lexiwind-mb-2",
      h5: "lexiwind-text-base lexiwind-font-bold lexiwind-mb-1",
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
      bold: "lexiwind-font-bold",
      code: "lexiwind-font-mono lexiwind-bg-gray-200 lexiwind-px-1 lexiwind-rounded",
      hashtag: "lexiwind-text-blue-500",
      italic: "lexiwind-italic",
      overflowed: "editor-text-overflowed",
      strikethrough: "lexiwind-line-through",
      underline: "lexiwind-underline",
      underlineStrikethrough: "lexiwind-underline lexiwind-line-through",
    },
  },
};

function Placeholder() {
  return (
    <div className="lexiwind-pointer-events-none lexiwind-absolute lexiwind-left-3 lexiwind-top-4 lexiwind-text-ellipsis lexiwind-text-sm lexiwind-text-gray-500">
      Enter some rich text...
    </div>
  );
}

export const Lexiwind = ({ value, onChange }: LexiwindPropsType) => {
  console.log(value, onChange);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="lexiwind-leading-20 lexiwind-max-w-3xl lexiwind-relative lexiwind-mx-auto lexiwind-my-20 lexiwind-overflow-hidden lexiwind-rounded-md lexiwind-p-2 lexiwind-text-left lexiwind-font-normal lexiwind-text-black">
        <ToolbarPlugin />
        <div className="lexiwind-relative lexiwind-bg-white lexiwind-border">
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
