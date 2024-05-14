import { cn } from "@/utils/cn";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin as RichText } from "@lexical/react/LexicalRichTextPlugin";
import { ReactNode } from "react";

type RichTextPluginProps = {
  classNames?: {
    contentEditable?: string;
    placeholder?: string;
  };
  placeholder?: string;
};

export const RichTextPlugin = ({
  classNames,
  placeholder,
}: RichTextPluginProps) => {
  return (
    <RichText
      contentEditable={
        <ContentEditable
          className={cn(
            classNames?.contentEditable
              ? classNames?.contentEditable
              : "lexiwind-relative lexiwind-min-h-[150px]	lexiwind-resize-none lexiwind-px-2 lexiwind-py-3 lexiwind-text-base lexiwind-caret-current lexiwind-outline-none lexiwind-outline-offset-0",
          )}
        />
      }
      placeholder={
        placeholder ? <Placeholder>{placeholder}</Placeholder> : null
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};

type PlaceholderPropsType = {
  children: ReactNode;
  classNames?: {
    placeholder?: string;
  };
};

export const Placeholder = ({ children, classNames }: PlaceholderPropsType) => {
  return (
    <div
      className={cn(
        classNames?.placeholder
          ? classNames?.placeholder
          : "editor-placeholder",
      )}
    >
      {children}
    </div>
  );
};
