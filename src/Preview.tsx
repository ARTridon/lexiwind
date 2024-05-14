"use client";

import { useState, useEffect } from "react";
import { Lexiwind, ToolbarPlugin, useToolbar, RichTextPlugin } from "lexiwind";
import { Button } from "./ui/Button";

export const Preview = () => {
  const [value, setValue] = useState(
    () => (localStorage.getItem("lexiwind-editor") as string) ?? "",
  );

  useEffect(() => {
    if (value) {
      localStorage.setItem("lexiwind-editor", JSON.stringify(value));
    }
  }, [value]);

  return (
    <>
      <Lexiwind
        value={value}
        onChange={setValue}
        classNames={{
          container: "lexiwind-container",
          input: "lexiwind-input",
        }}
      />
      <Lexiwind
        value={value}
        // only show content
        preview
      />

      <Lexiwind
      // custom editor toolbar
      >
        <div
          className={
            "lexiwind-border-1 lexiwind-mx-auto lexiwind-max-w-3xl lexiwind-rounded-lg lexiwind-bg-white lexiwind-p-4 lexiwind-shadow-md"
          }
        >
          <div className="editor-inner">
            <RichTextPlugin />
          </div>
          <ToolbarPlugin>
            <CustomToolbar />
          </ToolbarPlugin>
        </div>
      </Lexiwind>
    </>
  );
};

const CustomToolbar = () => {
  const toolbar = useToolbar();

  return (
    <div className="lexiwind-flex lexiwind-flex-wrap lexiwind-gap-3 lexiwind-p-1">
      <Button disabled={!toolbar.canUndo} onClick={toolbar.undoHandler}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
      </Button>
      <Button disabled={!toolbar.canRedo} onClick={toolbar.redoHandler}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 14 5-5-5-5" />
          <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
        </svg>
      </Button>
    </div>
  );
};
