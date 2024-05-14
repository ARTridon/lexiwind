# Lexiwind

This is a simple React application where I utilize Lexiwind, a custom Tailwind CSS variant, for styling and shadcn/ui for UI components.

## Installation

1. npm i lexiwind or pnpm i

## Preview

<img src='/public/preview.png' width='100%' >

```sh
"use client";

import { useState, useEffect } from "react";
import { Lexiwind } from "./Lexiwind";

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
      <Lexiwind value={value} onChange={setValue} />
      <Lexiwind
        value={value}
        // only show content
        preview
      />
    </>
  );
};
```


## Custom Toolbar Type

```sh
type ToolbarContextType = {
  canUndo: boolean;
  canRedo: boolean;
  isBold: boolean;
  isUnderline: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  undoHandler: () => void;
  redoHandler: () => void;
  boldHandler: () => void;
  italicHandler: () => void;
  underlineHandler: () => void;
  strikethroughHandler: () => void;
}
```

## Custom Toolbar

```sh
"use client";

import { useState, useEffect } from "react";
import { Lexiwind,useToolbar } from "lexiwind";

export const Preview = () => {

  return (
    <Lexiwind
      // custom editor toolbar
      >
        <div
          className={
            "some-wrapper-class"
          }
        >
          <div className="some-inner-class">
            <RichTextPlugin />
          </div>
          <ToolbarPlugin>
            <CustomToolbar />
          </ToolbarPlugin>
        </div>
      </Lexiwind>
  );
};

// CustomToolbar Component
const CustomToolbar = () => {
  const toolbar = useToolbar();

  return (
    <div className="some-wrapper-toolbar-class">
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
      ...
    </div>
  );
};
```




## Technologies Used

- React.js
- tailwind
- shadcn/ui
- lexical

## Credits

- [react](https://react.dev)
- [lexical](https://lexical.dev)
- [tailwind](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## License

This project is licensed under the [MIT License](LICENSE).
