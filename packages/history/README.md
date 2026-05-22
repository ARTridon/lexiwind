# @lexiwind/history

Undo/redo history plugin for Lexiwind — manage editor state history with keyboard shortcuts.

## Overview

This plugin adds complete undo/redo functionality to your Lexiwind editor. It manages the editor's state history and provides keyboard shortcuts (Ctrl+Z / Cmd+Z for undo, Ctrl+Shift+Z / Cmd+Shift+Z for redo).

## Installation

```bash
npm install @lexiwind/history
```

## Features

- **Undo/Redo** — Navigate through editor state history
- **Keyboard shortcuts** — Built-in Ctrl+Z and Ctrl+Shift+Z support
- **History limit** — Configurable history size to manage memory
- **State snapshots** — Efficient state management

## Quick Start

Add the plugin to your editor:

```tsx
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexiwind/history";

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <HistoryPlugin />
      {/* other plugins... */}
    </LexicalComposer>
  );
}
```

## Usage with Hooks

```tsx
import { useHistory } from "@lexiwind/history";

function UndoRedoButtons() {
  const { canUndo, canRedo, undo, redo } = useHistory();

  return (
    <>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </>
  );
}
```

## API

### HistoryPlugin

Main plugin component for history management.

**Props:**
- `maxHistorySize` (optional): Maximum history states to keep. Default: `100`

### useHistory Hook

```tsx
const { canUndo, canRedo, undo, redo } = useHistory();
```

Returns:
- `canUndo`: Boolean indicating if undo is available
- `canRedo`: Boolean indicating if redo is available
- `undo()`: Function to perform undo
- `redo()`: Function to perform redo

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for more examples.
