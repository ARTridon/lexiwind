# @lexiwind/config-typescript

Shared TypeScript configuration for Lexiwind packages — strict type checking across all packages.

## Overview

This package provides the TypeScript configuration used across all Lexiwind packages. Use it in your projects for consistent TypeScript settings and strict type safety.

## Installation

```bash
npm install --save-dev @lexiwind/config-typescript
```

## Setup

Extend in your `tsconfig.json`:

```json
{
  "extends": "@lexiwind/config-typescript"
}
```

## Configuration Highlights

- **Strict mode** — All strict type checking enabled
- **Target** — ES2020 and ESNext module system
- **JSX** — React JSX support
- **Module resolution** — Node-style resolution
- **Declaration** — Declaration file generation enabled

## Customization

Override settings in your `tsconfig.json`:

```json
{
  "extends": "@lexiwind/config-typescript",
  "compilerOptions": {
    "target": "ES2019",
    "lib": ["ES2019", "DOM"]
  }
}
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for TypeScript setup details.
