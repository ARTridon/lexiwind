# @lexiwind/collapsible

Collapsible block plugin for Lexiwind — expandable/collapsible content blocks without CSS files (Tailwind-native).

## Overview

This plugin adds collapsible/expandable block functionality. Users can hide and reveal content sections, perfect for FAQs, details sections, and accordion layouts. Uses pure Tailwind CSS styling.

## Installation

```bash
npm install @lexiwind/collapsible
```

## Features

- **Expand/collapse** — Toggle content visibility
- **Tailwind-native** — No CSS files required
- **Nested support** — Collapsible sections can contain other blocks
- **Keyboard accessible** — Space/Enter to toggle
- **State persistence** — Remember open/closed state
- **Smooth animations** — CSS transitions included

## Quick Start

```tsx
import { CollapsiblePlugin } from "@lexiwind/collapsible";

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <CollapsiblePlugin />
    </LexicalComposer>
  );
}
```

## Usage

Insert a collapsible block:

```tsx
import { INSERT_COLLAPSIBLE_COMMAND } from "@lexiwind/collapsible";

editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, { title: "Click to expand" });
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for advanced collapsible examples.
