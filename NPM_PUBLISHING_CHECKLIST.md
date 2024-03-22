# NPM Publishing Setup Checklist for @lexiwind Scope

This document lists **verified configurations** and the **manual steps you MUST complete** to publish scoped packages successfully.

---

## ✅ VERIFIED: Code Configuration

All of the following have been verified and are correctly configured:

- [x] **All 15 packages have `publishConfig`** ✅
  ```
  ✅ code
  ✅ collapsible
  ✅ config-eslint
  ✅ config-typescript
  ✅ core
  ✅ create-lexiwind
  ✅ embeds
  ✅ floating-toolbar
  ✅ history
  ✅ mentions
  ✅ react
  ✅ slash-command
  ✅ table
  ✅ themes
  ✅ toolbar
  ```

- [x] **`.npmrc` scope mapping configured** ✅
  ```
  registry=https://registry.npmjs.org/
  @lexiwind:registry=https://registry.npmjs.org/
  //registry.npmjs.org/:_authToken=${NPM_TOKEN}
  ```

- [x] **`.changeset/config.json` correct** ✅
  ```json
  {
    "access": "public",
    "baseBranch": "main",
    "updateInternalDependencies": "patch"
  }
  ```

- [x] **GitHub Actions workflows correct** ✅
  - `publish.yml`: Permissions, env vars, Changesets action all correct
  - `version.yml`: Permissions, canary publish setup correct

---

## ⚠️ REQUIRED: Manual Setup Steps (YOU MUST DO)

### PHASE 1: Verify Your npm Account Access

**Step 1.1: Check if you own the @lexiwind scope**

```bash
npm owner ls @lexiwind/core
```

**Expected output:**
```
lexiwind:       your-npm-username
```

**If you get 404 or permission denied:**
- ❌ You are NOT an owner of the @lexiwind scope
- Contact the organization owner to add you as owner:
  ```bash
  # Organization owner must run:
  npm org set @lexiwind <your-username> owner
  ```

**Step 1.2: Verify you are logged in locally (for testing)**

```bash
npm whoami
```

**Should show your npm username.** If not:
```bash
npm login
# Follow prompts to enter credentials
```

---

### PHASE 2: Generate Granular Access Token on npm.com

**Critical: Token must be created with "All packages" access, not restricted to specific packages.**

**Steps:**

1. Go to: https://npmjs.com
2. Click your **profile icon** → **Account**
3. Click **Access Tokens** tab
4. Click **Generate new token** → **Granular Access Token**
5. **Configure token:**
   - **Token name:** `GitHub Actions - Lexiwind Publishing`
   - **Permissions:** `Publish packages and manage package settings`
   - **Package access:** ⚠️ **ALL PACKAGES** (DO NOT select "Specific packages")
   - **Expiry:** 90 days (recommended)
6. Click **Generate token**
7. **Copy the token immediately** (you won't see it again)

**Save it somewhere safe for Step 3.**

---

### PHASE 3: Add NPM_TOKEN to GitHub Secrets

**Steps:**

1. Go to: https://github.com/ARTridon/lexiwind
2. Click **Settings** (repository settings, not personal)
3. Go to **Secrets and variables** → **Actions**
4. If `NPM_TOKEN` secret already exists:
   - Click the pencil icon next to it
   - Delete the old value
   - Paste the NEW token from Step 2.7
   - Click **Update secret**
5. If `NPM_TOKEN` does NOT exist:
   - Click **New repository secret**
   - **Name:** `NPM_TOKEN` (exact case)
   - **Value:** Paste token from Step 2.7
   - Click **Add secret**

---

### PHASE 4: Test the Pipeline (Optional but Recommended)

**Test on canary branch (low-risk):**

```bash
# Make sure you're on main with latest changes
git checkout main
git pull origin main

# Create a test changeset
pnpm changeset

# → Select a package (e.g., @lexiwind/core)
# → Select "patch" version bump
# → Add a test description

# Commit and push to canary
git add .changeset/
git commit -m "chore: test canary release"
git push origin main:canary

# Monitor GitHub Actions:
# → Go to github.com/ARTridon/lexiwind/actions
# → Watch the "Canary Release" workflow
# → Check the "Publish canary" step for errors
```

If successful, you'll see packages published with @canary tag:
```bash
npm install @lexiwind/core@canary
```

**On main branch (production release):**

```bash
# Make a real change
git checkout -b feat/my-feature
# ... edit code ...
pnpm lint && pnpm typecheck && pnpm build

# Add changeset
pnpm changeset
# → Select packages that changed
# → Select version bump (major/minor/patch)

# Commit and push
git add .changeset/
git commit -m "feat: my change"
git push origin feat/my-feature

# Open PR, get approval, merge to main
# → GitHub Actions will:
#    1. Create "Version Packages" PR
#    2. Merge it automatically
#    3. Publish all packages to npm

# Verify packages published:
npm view @lexiwind/core
npm view @lexiwind/history
```

---

## 🔍 TROUBLESHOOTING

| Error | Cause | Fix |
|-------|-------|-----|
| `E404 Not Found` on npm publish | (1) You're not owner of @lexiwind scope, OR (2) NPM_TOKEN was created with "Specific packages" instead of "All packages" | (1) Get added as owner by org owner, (2) Generate new token with "All packages" |
| `401 Unauthorized` | NPM_TOKEN doesn't exist or is invalid | Generate new Granular Access Token at npmjs.com and update GitHub secret |
| `403 Forbidden` | Token is valid but expired or revoked | Generate new Granular Access Token and update GitHub secret |
| `ENEEDAUTH` | NPM_TOKEN not passed to workflow correctly | Check GitHub secret exists, check env var name is `NPM_TOKEN` (not `NODE_AUTH_TOKEN`) |
| GitHub Actions secret not found | Secret not added to repo | Go to Settings → Secrets → Add `NPM_TOKEN` with your token value |

---

## 📋 Pre-Release Checklist

Before merging to main (which triggers publish):

- [ ] All packages build successfully: `pnpm build`
- [ ] All packages typecheck: `pnpm typecheck`
- [ ] Linting passes: `pnpm lint`
- [ ] Changesets created for all modified packages: `pnpm changeset`
- [ ] You are an owner of @lexiwind scope (verified in Step 1.1)
- [ ] NPM_TOKEN secret is set in GitHub (verified in Step 3)
- [ ] NPM_TOKEN is a Granular Access Token with "All packages" (not specific packages)
- [ ] NPM_TOKEN has "Publish packages" permission
- [ ] NPM_TOKEN is not expired

---

## ✨ After Setup is Complete

Once all manual steps are done, the release process is fully automated:

```bash
# You just:
git push origin feat/my-feature  # → Create PR
# → Get approval
# → Merge to main

# GitHub Actions automatically:
# 1. Runs CI (lint, typecheck, build)
# 2. Creates "Version Packages" PR (auto-bumped versions)
# 3. Merges "Version Packages" PR
# 4. Publishes all changed packages to npm
# 5. All @lexiwind/* packages are live on npm

# End users install with:
npm install @lexiwind/core@latest
npm install @lexiwind/history@latest
```

---

## 📞 Need Help?

- **npm docs:** https://docs.npmjs.com/creating-and-viewing-authentication-tokens
- **Changesets docs:** https://github.com/changesets/changesets
- **GitHub Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

**Status:** Code configuration ✅ verified and ready. Awaiting manual npm account setup.

**Last updated:** 2026-05-23
