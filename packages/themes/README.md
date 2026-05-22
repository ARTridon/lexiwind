# @lexiwind/themes

Pre-built Tailwind CSS themes for Lexiwind — professional, ready-to-use editor themes.

## Overview

This package provides pre-built theme configurations for Lexiwind editors, using Tailwind CSS for consistent and customizable styling.

## Installation

```bash
npm install @lexiwind/themes
```

## Available Themes

- **shadcn/ui** — Modern, component-based design
- **Light** — Clean, minimal light theme
- **Dark** — Comfortable dark theme
- **Custom** — Create your own theme

## Quick Start

```tsx
import { ThemeProvider, useTheme } from "@lexiwind/themes";
import { shadcnTheme } from "@lexiwind/themes/shadcn";

export function MyApp() {
  return (
    <ThemeProvider theme={shadcnTheme}>
      <MyEditor />
    </ThemeProvider>
  );
}
```

## Using Themes in Editor

```tsx
import { LexiwindEditor } from "@lexiwind/react";
import { darkTheme } from "@lexiwind/themes";

export function MyEditor() {
  return (
    <div className={darkTheme.className}>
      <LexiwindEditor />
    </div>
  );
}
```

## Customizing Themes

```tsx
const customTheme = {
  ...shadcnTheme,
  colors: {
    primary: "#custom-color",
  },
};
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for theme customization examples.
