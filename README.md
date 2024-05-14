# Lexiwind

This is a simple React application where I utilize Lexiwind, a custom Tailwind CSS variant, for styling and shadcn/ui for UI components.

## Installation

1. npm i lexiwind or pnpm i

## Preview

<img src='/public/preview.png' width='100%' >

## Simple Use Example

```sh
"use client";

import { useState, useEffect } from "react";
import { Lexiwind } from "./Lexiwind";

export const Preview = () => {
  const [value, setValue] = useState("",);

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

## Custom Toolbar Example

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
        ...
      </Button>
      <Button disabled={!toolbar.canRedo} onClick={toolbar.redoHandler}>
        ...
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
