# @lexiwind/code

Code block plugin for Lexiwind — syntax-highlighted code blocks with language selection.

## Overview

This plugin adds support for code blocks in your Lexiwind editor. It provides syntax highlighting and allows users to select programming languages for better code readability.

## Installation

```bash
npm install @lexiwind/code
```

## Features

- **Syntax highlighting** for multiple programming languages
- **Language selection** dropdown in code blocks
- **Easy integration** with Lexiwind editors
- **Customizable** default language

## Quick Start

First, register the `CodeNode` in your editor configuration:

```tsx
import { CodeNode } from "@lexical/code";
import { CodePlugin } from "@lexiwind/code";

export const editorConfig = {
  nodes: [CodeNode, /* other nodes... */],
};
```

Then use the plugin in your editor:

```tsx
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { CodePlugin } from "@lexiwind/code";

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <CodePlugin defaultLanguage="javascript" />
      {/* other plugins... */}
    </LexicalComposer>
  );
}
```

## API

### CodePlugin

Main plugin component for code block support.

**Props:**
- `defaultLanguage` (optional): Default programming language for code blocks. Default: `"javascript"`

### INSERT_CODE_COMMAND

Command to programmatically insert a code block:

```tsx
import { INSERT_CODE_COMMAND } from "@lexiwind/code";

editor.dispatchCommand(INSERT_CODE_COMMAND, { language: "python" });
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for more examples and use cases.
