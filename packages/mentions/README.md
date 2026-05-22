# @lexiwind/mentions

Configurable @mentions plugin for Lexiwind — mention users with autocomplete.

## Overview

This plugin enables @mentions functionality in your editor with customizable user lists and autocomplete suggestions.

## Installation

```bash
npm install @lexiwind/mentions
```

## Features

- **Mention triggers** — @ symbol triggers mention menu
- **Autocomplete** — Search and select from user list
- **Custom formatting** — Style mentions differently
- **Keyboard navigation** — Arrow keys to navigate

## Quick Start

```tsx
import { MentionsPlugin } from "@lexiwind/mentions";

const users = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <MentionsPlugin users={users} />
    </LexicalComposer>
  );
}
```

## Configuration

```tsx
interface MentionsPluginProps {
  users: Array<{ id: string; name: string }>;
  onMention?: (userId: string) => void;
}
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for examples.
