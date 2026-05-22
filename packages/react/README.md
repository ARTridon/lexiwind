# @lexiwind/react

React integration for Lexiwind — LexiwindEditor component and core hooks for building rich text editors.

## Overview

This package provides the main React component and hooks for integrating Lexiwind into your React applications. It includes the `LexiwindEditor` component which handles the editor initialization and plugin management.

## Installation

```bash
npm install @lexiwind/react
```

## Features

- **LexiwindEditor component** — Ready-to-use editor with sensible defaults
- **Core hooks** — `useEditor`, `useSelection`, and other utilities
- **Plugin support** — Easy plugin integration
- **Type-safe** — Full TypeScript support

## Quick Start

Basic editor setup:

```tsx
import { LexiwindEditor } from "@lexiwind/react";

export function MyApp() {
  return (
    <LexiwindEditor
      onEditorStateChange={(editorState) => {
        console.log("Editor content changed:", editorState);
      }}
    />
  );
}
```

## Usage with Plugins

```tsx
import { LexiwindEditor } from "@lexiwind/react";
import { HistoryPlugin } from "@lexiwind/history";
import { CodePlugin } from "@lexiwind/code";
import { TablePlugin } from "@lexiwind/table";

export function FeatureRichEditor() {
  return (
    <LexiwindEditor>
      <HistoryPlugin />
      <CodePlugin />
      <TablePlugin />
    </LexiwindEditor>
  );
}
```

## API

### LexiwindEditor

Main editor component for Lexiwind.

**Props:**
- `onEditorStateChange` (optional): Callback when editor state changes
- `children` (optional): Plugins to include in the editor
- `className` (optional): CSS class for styling

### Hooks

Core hooks for working with the editor:

```tsx
import { useEditor, useSelection } from "@lexiwind/react";

function MyComponent() {
  const editor = useEditor();
  const selection = useSelection();
  
  // Use editor and selection...
}
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for detailed examples and API reference.
