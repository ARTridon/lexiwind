# @lexiwind/slash-command

Extensible slash-command picker for Lexiwind — trigger actions with `/` commands.

## Overview

This plugin provides slash-command functionality allowing users to type `/` to access a menu of commands that can insert blocks, apply formatting, or trigger custom actions.

## Installation

```bash
npm install @lexiwind/slash-command
```

## Features

- **Command picker** — Type `/` to open command menu
- **Extensible** — Add custom commands easily
- **Keyboard navigation** — Arrow keys to browse
- **Search** — Filter commands by name
- **Icons** — Visual command identification

## Quick Start

```tsx
import { SlashCommandPlugin } from "@lexiwind/slash-command";

const commands = [
  { label: "Heading 1", command: () => {...} },
  { label: "Code Block", command: () => {...} },
];

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <SlashCommandPlugin commands={commands} />
    </LexicalComposer>
  );
}
```

## Adding Custom Commands

```tsx
const myCommands = [
  {
    label: "Custom Action",
    icon: "✨",
    command: (editor) => {
      // Your logic here
    },
  },
];
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for more command examples.
