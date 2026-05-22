# @lexiwind/table

Table plugin for Lexiwind — create and manage tables in your editor with ease.

## Overview

This plugin adds table support to Lexiwind editors. Users can insert, edit, and format tables with rows and columns.

## Installation

```bash
npm install @lexiwind/table
```

## Features

- **Table creation** — Insert tables with custom row/column count
- **Row/column management** — Add, delete, or modify rows and columns
- **Cell editing** — Edit cell content directly
- **Merge cells** — Combine adjacent cells
- **Styling** — Apply formatting to table content

## Quick Start

```tsx
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { TablePlugin } from "@lexiwind/table";

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <TablePlugin />
    </LexicalComposer>
  );
}
```

## Usage

Insert a table with the INSERT_TABLE_COMMAND:

```tsx
import { INSERT_TABLE_COMMAND } from "@lexiwind/table";

editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: 3, cols: 3 });
```

## API

### TablePlugin

Main plugin for table support.

### INSERT_TABLE_COMMAND

Insert a table into the editor:

```tsx
dispatchCommand(INSERT_TABLE_COMMAND, { rows: number, cols: number })
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for more table examples and advanced features.
