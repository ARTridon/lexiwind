# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs for the Lexiwind monorepo.

## Workflow

1. Make your changes
2. Run `pnpm changeset` to describe the change (patch / minor / major)
3. Commit the generated changeset file along with your code
4. Open a pull request — CI will validate the build
5. When the PR merges, the Changesets bot opens a **"Version Packages"** PR
6. Merging *that* PR publishes all updated packages to npm automatically

## Canary releases

Push to the `canary` branch to trigger a canary snapshot publish under the `canary` dist-tag.

```sh
pnpm changeset version --snapshot canary
pnpm changeset publish --tag canary
```
