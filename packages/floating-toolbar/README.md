# @lexiwind/floating-toolbar

Floating selection toolbar plugin for Lexiwind — context toolbar that appears above selected text.

## Overview

This plugin displays a floating toolbar above the user's selection, providing quick access to text formatting options like bold, italic, and link insertion without interrupting the editing flow.

## Installation

```bash
npm install @lexiwind/floating-toolbar
```

## Features

- **Context menu** — Appears on text selection
- **Formatting tools** — Bold, italic, underline, link buttons
- **Auto-positioning** — Stays visible above selection
- **Customizable** — Add your own toolbar buttons
- **Keyboard support** — Arrow keys to navigate

## Quick Start

```tsx
import { FloatingToolbarPlugin } from "@lexiwind/floating-toolbar";

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <FloatingToolbarPlugin />
    </LexicalComposer>
  );
}
```

## Custom Buttons

Add custom buttons to the toolbar:

```tsx
const customButtons = [
  { label: "Bold", action: (editor) => editor.dispatchCommand(...) },
  { label: "Custom", action: (editor) => {...} },
];

<FloatingToolbarPlugin buttons={customButtons} />
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for toolbar customization examples.
