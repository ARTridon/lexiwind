# Contributing to Lexiwind

## Prerequisites

- Node.js 18+
- pnpm 9+

```sh
corepack enable
corepack prepare pnpm@9 --activate
```

## Setup

```sh
git clone https://github.com/ARTridon/lexiwind.git
cd lexiwind
pnpm install
```

## Project structure

```
lexiwind/               ← main lexiwind package (vite library build)
packages/
  core/                 ← @lexiwind/core — shared types & contracts
  toolbar/              ← @lexiwind/toolbar — headless toolbar hooks
  slash-command/        ← @lexiwind/slash-command — extensible slash menu
  mentions/             ← @lexiwind/mentions — @mentions plugin
  embeds/               ← @lexiwind/embeds — URL embed plugin
  collapsible/          ← @lexiwind/collapsible — collapsible blocks
  create-lexiwind/      ← create-lexiwind CLI
```

## Development

```sh
# Watch-build all workspace packages
pnpm packages:dev

# Typecheck everything
pnpm packages:typecheck

# Build all packages once
pnpm packages:build
```

## Making changes

1. Create a feature branch: `git checkout -b feat/my-change`
2. Make changes in the relevant `packages/<name>/src/` directory
3. Add a changeset describing the impact:

```sh
pnpm changeset
```

Choose the bump type:
- **patch** — bug fix, docs, internal refactor (no public API change)
- **minor** — new feature, additive API change (backwards compatible)
- **major** — breaking change

4. Commit your code **and** the generated `.changeset/*.md` file
5. Open a pull request

> PRs without a changeset will not trigger a release. If your change doesn't affect any published package (e.g. tooling only), that's fine — just don't add a changeset.

## Release process

Merging to `main` triggers the Changesets GitHub Action:
- If pending changesets exist → a **"Version Packages"** PR is opened/updated
- Merging *that* PR → all bumped packages are published to npm automatically

## Canary releases

Push to the `canary` branch to publish snapshot releases under the `canary` dist-tag:

```sh
pnpm add @lexiwind/collapsible@canary
```

## Workspace governance

Every package in the monorepo must provide:

- **`build`** — `"tsup"` (or noop for config-only packages)
- **`lint`** — `"eslint src --max-warnings=0"`
- **`typecheck`** — `"tsc --noEmit"`

These scripts are orchestrated via `turbo run {build,lint,typecheck}`. Missing or broken scripts will break CI. See [workspace-lifecycle-policy.md](../rules/workspace-lifecycle-policy.md) for details.

## Code style

- TypeScript strict mode throughout
- No runtime CSS — use Tailwind classes in `createDOM()` or via `config.theme`
- `sideEffects: false` on all library packages
- No default exports from packages (named exports only)
- No comments explaining *what* code does — only *why* when non-obvious
