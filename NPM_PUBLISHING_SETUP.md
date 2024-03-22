# NPM Publishing Setup for Lexiwind

This document describes the one-time setup required to enable automatic npm publishing via GitHub Actions and Changesets.

## Current Status

✅ **Configuration files updated:**
- `.npmrc` — configured with `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`
- `.github/workflows/publish.yml` — passes `NPM_TOKEN` environment variable
- `.github/workflows/version.yml` — passes `NPM_TOKEN` environment variable

⚠️ **Still needed (manual step in GitHub UI):**
- Create NPM automation token
- Add `NPM_TOKEN` secret to GitHub repository

---

## One-Time Setup (5 minutes)

### Step 1: Generate NPM Automation Token

1. Go to https://npmjs.com
2. Click your **profile icon** → **Account**
3. Go to **Access Tokens** tab
4. Click **Generate new token** → **Granular Access Token**
5. **Configure token:**
   - **Token type:** Granular Access Token (recommended)
   - **Token name:** `GitHub Actions - Lexiwind Publishing`
   - **Permissions:** Select "Publish packages and manage package settings"
   - **Package access:** "All packages"
   - **Expiry:** 90 days (or your preference)

6. Click **Generate token**
7. **Copy the token immediately** (you won't see it again)

### Step 2: Add to GitHub Secrets

1. Go to https://github.com/ARTridon/lexiwind
2. Click **Settings** (repo settings, not personal)
3. Go to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. **Name:** `NPM_TOKEN` (exactly this, case-sensitive)
6. **Value:** Paste the token from Step 1
7. Click **Add secret**

### Step 3: Verify Setup

Test on the `canary` branch:

```bash
git checkout canary
git pull origin canary

# Add a changeset
pnpm changeset

# Commit and push
git add .
git commit -m "chore: test canary release"
git push origin canary
```

Monitor the **Actions** tab:
- Workflow should run and complete successfully
- Check "Publish canary" step — should NOT show ENEEDAUTH errors

If successful, canary packages are published:
```bash
npm install @lexiwind/core@canary
```

---

## How It Works

### Authentication Flow

```
1. Developer pushes to main/canary branch
2. GitHub Actions workflow starts
3. Workflow reads NPM_TOKEN from GitHub Secrets
4. Token is passed to workflow as environment variable
5. .npmrc reads ${NPM_TOKEN} from environment
6. npm/pnpm authenticate using token
7. Changesets publishes packages to npm
8. Workflow completes successfully
```

### What Each File Does

**`.npmrc`** — npm registry configuration
- Declares npm registry: `registry=https://registry.npmjs.org/`
- Declares auth token placeholder: `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`
- The `${NPM_TOKEN}` is a shell variable that gets substituted at runtime

**`.github/workflows/publish.yml`** — Production release workflow
- Runs on push to `main` branch
- Runs lint, typecheck, build validation
- Uses Changesets to version and publish packages
- Passes `NPM_TOKEN=${{ secrets.NPM_TOKEN }}` to the publish step

**`.github/workflows/version.yml`** — Canary release workflow
- Runs on push to `canary` branch
- Creates snapshot version (e.g., `1.2.0-canary.0`)
- Publishes to npm with `@canary` tag
- Passes `NPM_TOKEN=${{ secrets.NPM_TOKEN }}` to the publish step

---

## Troubleshooting

### "ENEEDAUTH" error during publish

**Cause:** NPM_TOKEN secret not set in GitHub, or token is invalid.

**Fix:**
1. Verify secret exists:
   - Go to repo **Settings** → **Secrets and variables** → **Actions**
   - Check for `NPM_TOKEN` (must be exact name)
2. Verify token is valid:
   - Go to npmjs.com → **Access Tokens**
   - Check token hasn't expired or been revoked
3. Re-add secret if needed:
   - Delete old secret
   - Generate new token at npmjs.com
   - Add new secret to GitHub

### "401 Unauthorized"

**Cause:** Token is valid but doesn't have publish permission.

**Fix:**
1. Go to npmjs.com → **Access Tokens**
2. Click token name
3. Ensure "Publish packages" permission is enabled
4. Ensure "Package access" is set to "All packages" (or lists `@lexiwind/*`)

### Token expired

**Cause:** Granular tokens expire (default 90 days).

**Fix:**
1. Go to npmjs.com → **Access Tokens**
2. Generate new token (same permissions as before)
3. Update GitHub secret:
   - Go to repo **Settings** → **Secrets** → `NPM_TOKEN`
   - Click pencil icon
   - Paste new token value
   - Click **Update secret**

---

## Token Security Best Practices

✅ **Do:**
- Use **Granular Access Tokens** (not classic tokens)
- Set **limited permissions** (publish only, not delete/admin)
- Set **package access** to "All packages" (for monorepo) or specific packages
- Set **expiry** to 90 days or less
- Rotate tokens periodically
- Store token **only in GitHub Secrets** (never in code, docs, or env files)

❌ **Don't:**
- Commit tokens to git (even if in `.gitignore`, it's risky)
- Use personal access tokens (not designed for npm)
- Share token URLs or values in chat/docs
- Set token expiry to "Never" (disable this option)

---

## Release Process (After Setup)

### Production Release (npm stable)

```bash
# Make changes, test locally
git checkout -b feat/my-change
# ... make changes ...
pnpm lint && pnpm typecheck && pnpm build

# Add changeset
pnpm changeset

# Commit and push
git add .
git commit -m "feat: my change"
git push origin feat/my-change

# Open PR, get approval, merge to main
# GitHub Actions will:
# 1. Open "Version Packages" PR (auto-bumped versions)
# 2. Merge "Version Packages" PR
# 3. Publish all bumped packages to npm
```

Packages are now available:
```bash
npm install @lexiwind/core@latest
```

### Canary Release (pre-release testing)

```bash
# Push directly to canary branch
git push origin feat/my-change:canary

# GitHub Actions will:
# 1. Version as snapshot (1.2.0-canary.0)
# 2. Publish to npm with @canary tag
```

Test canary:
```bash
npm install @lexiwind/core@canary
```

---

## Changesets Configuration

Lexiwind uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

**Key points:**
- Each PR with package changes needs a changeset file (`.changeset/*.md`)
- Changesets are committed to the repo (not generated)
- Merging to main triggers automatic versioning and publishing
- Canary branch publishes snapshot releases for testing

See [CONTRIBUTING.md](CONTRIBUTING.md) for changeset creation workflow.

---

## Verification Commands

After setup is complete, verify with:

```bash
# Check .npmrc is configured
cat .npmrc | grep "authToken"

# Check workflows have NPM_TOKEN
grep -r "NPM_TOKEN" .github/workflows/

# Dry-run publish (local only, doesn't actually publish)
pnpm changeset publish --no-git-checks --dry-run
```

---

## Questions?

- npm docs: https://docs.npmjs.com/creating-and-viewing-authentication-tokens
- Changesets docs: https://github.com/changesets/changesets/blob/main/docs/publishing.md
- GitHub Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

**Last updated:** 2026-05-22  
**Status:** Ready for production publishing
