# @lexiwind/embeds

Unified URL embed plugin for Lexiwind — embed YouTube, Twitter, Figma, and custom content.

## Overview

This plugin automatically converts URLs into embedded content. Paste a YouTube, Twitter, Figma, or other supported service link and it transforms into an interactive embed.

## Installation

```bash
npm install @lexiwind/embeds
```

## Features

- **Auto-detection** — Recognizes YouTube, Twitter, Figma URLs
- **Custom matchers** — Define matchers for custom services
- **Paste support** — Pastes URLs automatically convert to embeds
- **Lazy loading** — Embeds load on demand for performance

## Quick Start

```tsx
import { EmbedPlugin } from "@lexiwind/embeds";

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EmbedPlugin />
    </LexicalComposer>
  );
}
```

## Custom Embeds

Define custom embed matchers:

```tsx
const customMatcher = {
  pattern: /https:\/\/example\.com\/.*/,
  render: (url) => <CustomEmbed url={url} />,
};

<EmbedPlugin matchers={[customMatcher]} />
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for more embed examples.
