# Lexiwind

A modular, production-ready editor ecosystem built on top of [Lexical](https://lexical.dev/).

Lexiwind provides composable plugins, headless UI components, and complete tooling for building rich text editors. Inspired by [Tiptap](https://tiptap.dev/), [shadcn/ui](https://ui.shadcn.com/), and Lexical itself.

---

## Overview

Lexiwind is a plugin-based framework for building feature-rich text editors without vendor lock-in. Instead of a monolithic editor, you compose what you need:

- **Plugins** for functionality (tables, code blocks, slash commands, mentions, etc.)
- **Headless hooks** to build your own UI (or use pre-built shadcn/ui components)
- **CLI scaffolding** to bootstrap new editor projects
- **Reference implementations** (demo apps) to learn from

Whether you're building a simple note editor or a complex document collaboration platform, Lexiwind provides the foundation without forcing architectural decisions.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Core** | Lexical | 0.44.0 |
| **Runtime** | React | 18.2+ |
| **Language** | TypeScript | 5.5+ |
| **Build** | Vite, tsup | - |
| **Package Manager** | pnpm | 9.14.2+ |
| **Build Orchestration** | Turbo | 2.3+ |
| **Styling** | Tailwind CSS | - |
| **Testing** | Vitest + jsdom | - |
| **Linting** | ESLint | 8.57+ |

---

## Features

### Core Architecture
- **Modular plugins** — each plugin is an independent package
- **Composable hooks** — `useToolbar()`, `useTable()`, `useCodeBlock()`, etc.
- **Headless design** — bring your own UI, or use shadcn/ui adapters
- **Zero runtime CSS** — all styling via Tailwind classes
- **TypeScript-first** — strict mode throughout, full type safety

### Included Plugins
- **History** (`@lexiwind/history`) — undo/redo
- **Toolbar** (`@lexiwind/toolbar`) — format state tracking and UI actions
- **Floating Toolbar** (`@lexiwind/floating-toolbar`) — context-aware floating formatting toolbar
- **Table** (`@lexiwind/table`) — rich table editing
- **Code Block** (`@lexiwind/code`) — syntax-highlighted code with language selection
- **Slash Commands** (`@lexiwind/slash-command`) — extensible `/` command palette
- **Mentions** (`@lexiwind/mentions`) — `@mentions` with custom search
- **Embeds** (`@lexiwind/embeds`) — URL embeds (Twitter, GitHub, YouTube, etc.)
- **Collapsible Blocks** (`@lexiwind/collapsible`) — disclosure/accordion blocks
- **Themes** (`@lexiwind/themes`) — light/dark mode and custom color schemes

### CLI & Scaffolding
- **create-lexiwind** — project scaffolding (TypeScript, Vite, ESLint, TypeScript config)

### Reference Implementation
- **demo-shadcn-lexiwind** — full-featured editor using shadcn/ui components

---

## Architecture: Plugin System

Lexiwind organizes functionality as **independent, composable plugins**. Each plugin is a standalone npm package that:

1. **Exports a Lexical plugin** (command/node registration, event listeners)
2. **Exports React hooks** for state and actions
3. **Declares peer dependencies** on `lexical` and `@lexical/react`
4. **Zero dependencies** on other Lexiwind plugins

### Plugin Registration Pattern

```typescript
// MyEditor.tsx
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexiwind/history';
import { ToolbarPlugin } from '@lexiwind/toolbar';
import { TablePlugin } from '@lexiwind/table';

export function MyEditor() {
  return (
    <LexicalComposer initialConfig={config}>
      {/* Plugins register themselves via Lexical's context */}
      <HistoryPlugin />
      <ToolbarPlugin />
      <TablePlugin />
      <EditorContent />
    </LexicalComposer>
  );
}
```

### UI Composition via Hooks

```typescript
// MyToolbar.tsx
import { useToolbar } from '@lexiwind/toolbar';

export function MyToolbar() {
  const { isBold, toggleBold, canUndo, undo } = useToolbar();

  return (
    <button
      data-active={isBold}
      onClick={() => toggleBold()}
    >
      Bold
    </button>
  );
}
```

**Key principle:** Plugins expose hooks, not components. You own the UI.

---

## Installation

### For Editor Developers (Using Lexiwind)

Install the packages you need:

```bash
npm install lexical @lexical/react @lexiwind/core @lexiwind/toolbar @lexiwind/table
# or
pnpm add lexical @lexical/react @lexiwind/core @lexiwind/toolbar @lexiwind/table
```

See the [demo app](examples/demo-shadcn-lexiwind) for a complete example.

### For Monorepo Development (Contributing)

**Requirements:**
- Node.js 18+
- pnpm 9+

**Setup:**

```bash
git clone https://github.com/ARTridon/lexiwind.git
cd lexiwind
corepack enable
corepack prepare pnpm@9 --activate
pnpm install
```

---

## Development

### Local Development

Start watch-mode builds for all packages:

```bash
# Build all packages with file watching
pnpm packages:dev

# In another terminal, start a demo app
pnpm --filter @lexiwind-examples/demo-shadcn dev
```

The demo app will hot-reload as you edit package code.

### Validation

```bash
# Typecheck all packages
pnpm typecheck

# Lint all files
pnpm lint

# Run smoke tests
pnpm test:smoke

# Build all packages (once)
pnpm build
```

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feat/my-feature
   ```

2. Make changes in the relevant package:
   ```bash
   # e.g., packages/code/src/...
   ```

3. Add a changeset to document the change:
   ```bash
   pnpm changeset
   ```

   Choose the version bump type:
   - **patch** — bug fix, internal refactor
   - **minor** — new feature (backwards compatible)
   - **major** — breaking change

4. Commit both code and the `.changeset/*.md` file:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

5. Open a pull request.

---

## Build & Production

### Building All Packages

```bash
pnpm build
```

This runs:
- `tsup` for all library packages → `dist/` folder
- `tsc --noEmit` for typecheck
- `eslint . --max-warnings=0` for linting

Output artifacts are in each package's `dist/` folder, ready for npm publishing.

### Publishing

This monorepo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

**Automatic Release Flow:**

1. Merge a PR with changesets to `main`
2. GitHub Action detects changesets → opens "Version Packages" PR
3. Merge "Version Packages" PR → all packages are published to npm automatically

**Canary Releases:**

Push to the `canary` branch to publish snapshot versions:

```bash
git push origin feat/my-feature:canary
```

Users can install canary builds:
```bash
npm install @lexiwind/toolbar@canary
```

---

## CI/CD

All builds and tests run in GitHub Actions on:
- **Trigger:** Push to `main` or `canary`, Pull Requests to `main`
- **Environment:** Ubuntu latest, Node 20, pnpm 9

### Pipeline Stages

1. **Install** — `pnpm install --frozen-lockfile`
2. **Lint** — `pnpm lint`
3. **Typecheck** — `pnpm typecheck`
4. **Build** — `pnpm build`
5. **Test** — `pnpm test:smoke`

If all pass, the commit is considered valid for merging.

**Release workflows** (on main) additionally:
- Run the full pipeline (lint, typecheck, build)
- Run changesets versioning
- Publish to npm with NPM_TOKEN

---

## Project Structure

```
lexiwind/
├── packages/
│   ├── core/                    # @lexiwind/core — shared types, Lexical nodes
│   ├── react/                   # @lexiwind/react — React integration utils
│   ├── toolbar/                 # @lexiwind/toolbar — format state & UI hooks
│   ├── floating-toolbar/        # @lexiwind/floating-toolbar — floating toolbar
│   ├── table/                   # @lexiwind/table — table plugin
│   ├── code/                    # @lexiwind/code — code block plugin
│   ├── history/                 # @lexiwind/history — undo/redo
│   ├── slash-command/           # @lexiwind/slash-command — slash menu
│   ├── mentions/                # @lexiwind/mentions — @mentions plugin
│   ├── embeds/                  # @lexiwind/embeds — URL embeds
│   ├── collapsible/             # @lexiwind/collapsible — disclosure blocks
│   ├── themes/                  # @lexiwind/themes — theme management
│   ├── config-eslint/           # Shared ESLint config
│   ├── config-typescript/       # Shared TypeScript config
│   └── create-lexiwind/         # CLI scaffolding tool
│
├── examples/
│   └── demo-shadcn-lexiwind/    # Reference implementation with shadcn/ui
│
├── .github/workflows/           # CI/CD pipelines
├── turbo.json                   # Turbo build orchestration config
├── pnpm-workspace.yaml          # pnpm workspace definition
├── tsconfig.base.json           # Base TypeScript config
├── CONTRIBUTING.md              # Contribution guidelines
└── README.md                    # This file
```

### Key Directories

- **`packages/core`** — Shared types, base nodes (HeadingNode, QuoteNode, etc.), command definitions
- **`packages/toolbar`** — Centralized toolbar state management (`useToolbar()` hook)
- **`packages/react`** — Lexical React wrapper utilities
- **`packages/create-lexiwind`** — CLI that scaffolds new editor projects
- **`examples/demo-shadcn-lexiwind`** — Production-quality reference editor using shadcn/ui

---

## Contributing

Contributions welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Local setup
- Code style (TypeScript strict, Tailwind-first, no `any`)
- Commit and PR workflow
- Changeset format

### Code Style Summary

- **TypeScript strict mode** — all code strongly typed
- **No CSS-in-JS** — use Tailwind classes in `createDOM()` or theme config
- **Headless components** — export hooks, not styled components
- **No default exports** — use named exports
- **No `any`** — use `unknown`, generics, or type narrowing
- **Minimal comments** — only explain *why*, not *what*

---

## Troubleshooting

### Build fails with "package X not found"

Ensure dependencies are installed:
```bash
pnpm install
```

If you just added a new workspace package, regenerate the lock file:
```bash
pnpm install
pnpm run build
```

### Type errors in IDE but `pnpm typecheck` passes

Your IDE may be using an older TypeScript version. Update:
```bash
npm install -g typescript@latest
```

Or use your editor's "Select TypeScript Version" command to pick the workspace version (`/node_modules/.pnpm/typescript@5.5.0/...`).

### ESLint warnings about unused variables

Ensure you've run the latest lint:
```bash
pnpm lint
```

Some rules (like `react-refresh/only-export-components`) may require refactoring. See [eslint-suppression-policy.md](rules/eslint-suppression-policy.md).

### `pnpm packages:dev` hangs or doesn't rebuild

Kill any existing dev processes:
```bash
pkill -f "turbo run dev"
```

Then restart:
```bash
pnpm packages:dev
```

---

## License

MIT © [ARTridon](https://github.com/ARTridon)

---

## Resources

- **Lexical docs:** https://lexical.dev/
- **Tiptap (inspiration):** https://tiptap.dev/
- **shadcn/ui:** https://ui.shadcn.com/
- **GitHub:** https://github.com/ARTridon/lexiwind

---

## Roadmap

See [plans/ROADMAP.md](plans/ROADMAP.md) for current development status and planned features.

---

**Questions?** Open an issue on [GitHub](https://github.com/ARTridon/lexiwind/issues) or check [Discussions](https://github.com/ARTridon/lexiwind/discussions).
