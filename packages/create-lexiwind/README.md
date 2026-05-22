# @lexiwind/create-lexiwind

Scaffold production-ready Lexiwind editors with zero config.

## Overview

This package provides a CLI tool to quickly scaffold a new Lexiwind editor project. It sets up all necessary dependencies, configurations, and example code so you can start building rich text editors immediately.

## Installation

```bash
npm install @lexiwind/create-lexiwind
```

## Quick Start

Create a new Lexiwind project:

```bash
npx @lexiwind/create-lexiwind init
```

This will guide you through:
- Project name and description
- Theme selection (shadcn, Tailwind, etc.)
- Plugin selection (code blocks, tables, history, etc.)
- Framework setup (React, Vue, etc.)

## Commands

### Init

Initialize a new Lexiwind editor project:

```bash
npx @lexiwind/create-lexiwind init
```

### Add Plugin

Add a new plugin to an existing project:

```bash
npx @lexiwind/create-lexiwind add
```

Select from available plugins:
- Code blocks
- Tables
- History (undo/redo)
- Mentions
- Embeds
- Slash commands
- And more...

### Add Theme

Add or change the project theme:

```bash
npx @lexiwind/create-lexiwind theme
```

Available themes:
- shadcn/ui
- Tailwind CSS
- Custom themes

## Features

- ✨ Zero configuration — Works out of the box
- 🎨 Theme selection — Choose from pre-built themes
- 🔌 Plugin discovery — Easily add plugins to your project
- 📦 Package management — Automatic dependency installation
- 🎯 Project generation — TypeScript + Vite by default

## Project Structure

After initialization, your project will have:

```
my-editor/
├── src/
│   ├── components/
│   ├── hooks/
│   └── App.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for examples and advanced configuration.
