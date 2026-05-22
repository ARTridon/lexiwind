# @lexiwind/toolbar

Headless toolbar state hooks and provider for Lexiwind — build completely custom editor toolbars.

## Overview

This package provides the state management and hooks needed to build custom toolbars. It's headless by design, letting you create toolbars that match your design system perfectly.

## Installation

```bash
npm install @lexiwind/toolbar
```

## Features

- **Headless design** — Complete control over UI
- **State hooks** — `useBlockType`, `useFontStyle`, `useFormatState`, etc.
- **Context provider** — Share toolbar state across components
- **Format detection** — Know current selection format in real-time
- **Action dispatch** — Simple API to apply formatting

## Quick Start

```tsx
import { ToolbarProvider, useToolbar } from "@lexiwind/toolbar";

function CustomToolbar() {
  const { isBold, toggleBold, blockType } = useToolbar();
  
  return (
    <button onClick={toggleBold} className={isBold ? "active" : ""}>
      Bold
    </button>
  );
}

export function MyEditor() {
  return (
    <ToolbarProvider>
      <LexicalComposer initialConfig={editorConfig}>
        <CustomToolbar />
      </LexicalComposer>
    </ToolbarProvider>
  );
}
```

## Available Hooks

- `useBlockType` — Current block type (h1, p, blockquote, etc.)
- `useFontStyle` — Font style state (bold, italic, underline)
- `useFormatState` — All formatting state
- `useAlignment` — Text alignment

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for toolbar patterns.
