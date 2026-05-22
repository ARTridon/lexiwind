# @lexiwind/core

Lexiwind plugin contracts, types, and extension interfaces — the foundation for all plugins.

## Overview

This package provides the core TypeScript types, interfaces, and contracts that all Lexiwind plugins must implement. It defines the plugin architecture and provides utilities for building custom plugins.

## Installation

```bash
npm install @lexiwind/core
```

## Key Exports

- **LexiwindPlugin** — Base plugin interface
- **LexiwindNode** — Custom node type interface
- **LexiwindCommand** — Command definition interface
- **EmbedMatcher** — URL embed matcher type

## Usage

Build a custom plugin:

```tsx
import { LexiwindPlugin } from "@lexiwind/core";

export function MyCustomPlugin(): LexiwindPlugin {
  return {
    name: "my-plugin",
    initialize(editor) {
      // Plugin initialization
    },
    cleanup() {
      // Cleanup
    },
  };
}
```

## Types

TypeScript interfaces for plugin development:

```tsx
interface LexiwindNode {
  createNode(): Node;
  updateNode(payload: any): void;
}

interface EmbedMatcher {
  pattern: RegExp;
  render: (url: string) => ReactNode;
}
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for plugin development guide.
