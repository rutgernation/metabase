# Maintaining this Metabase fork (upstream sync)

This file is **only for this repository’s fork** (Direct Control). It lives under `docs/direct-control/` so it does not overlap Metabase upstream paths and usually merges cleanly when pulling from [metabase/metabase](https://github.com/metabase/metabase).

## Goal

Keep **vanilla Metabase** as the base and reapply a **small set of intentional commits** on top whenever you move to a new release (patch, minor, or major).

## One-time: remotes

- `origin` — your fork (e.g. GitHub: `your-org/metabase`).
- `upstream` — `https://github.com/metabase/metabase.git`

```bash
git remote add upstream https://github.com/metabase/metabase.git   # if not already added
git fetch upstream --tags
```

## Track your custom changes

Keep a short list in this file or in your internal runbook:

| Topic | Commit / branch | Notes |
| ----- | ----------------- | ----- |
| Email recipient suggestions (`user-visibility` default) | Branch `v0.57.16-custom`, commit `05f08fe5b08` | Sets the `user-visibility` defsetting default from `:all` to `:group` in `src/metabase/users/settings.clj`, so email recipients are restricted to group members by default instead of all users. |

Update the **commit** column after each rebase or cherry-pick onto a new Metabase tag (the hash changes; the intent stays the same). Prefer **one commit per logical change** so cherry-picks and rebases stay simple.

## Approach A — Long-lived branch (merge)

Use when you want **one branch** (e.g. `v0.57.x-custom`) that you advance with merges.

1. Fetch tags: `git fetch upstream --tags`
2. Check out your custom branch.
3. Merge the **release tag** you target (stays closest to a release line):

   ```bash
   git merge v0.57.17
   ```

   For ongoing development from Metabase’s default branch, merging `upstream/master` is possible but pulls in unreleased work; prefer **release tags** for production images.

4. Resolve conflicts (usually only in files you changed).
5. Run tests / build as you normally do for a release.

## Approach B — Clean branch per release (cherry-pick)

Use when you want the history to stay **exactly** “upstream tag + N commits” with no merge commits.

1. `git fetch upstream --tags`
2. Create a branch from the new tag:

   ```bash
   git checkout -b v0.57.17-custom v0.57.17
   ```

3. Cherry-pick each custom commit (oldest first), e.g.:

   ```bash
   git cherry-pick <commit-sha>
   ```

4. Push the new branch and retire or keep the old tag branch as needed.

## Docker image build

Use a normal build-arg (no extra quotes around the value):

```bash
docker build --build-arg VERSION=0.57.17 -t your-registry/metabase:0.57.17 .
```

`bin/build.sh` is invoked with `clojure -X`, which parses arguments as **EDN**. A token like `0.57.16` without quotes is invalid EDN, so the `Dockerfile` must pass `:version` as a string, e.g. `:version "\"${VERSION}\""` in the `RUN` line. If you see `Unreadable arg: "0.57.16"`, the `:version` value was not passed as a quoted EDN string.

See `Dockerfile` in the repo for `MB_EDITION` (OSS vs EE).

## What usually does not need to live in the fork

- **Dockerfile workarounds** for transient registry errors (e.g. Yarn `502` from `registry.yarnpkg.com`). Retrying the build or waiting usually suffices; keeping that out of the fork avoids needless merge noise.
- **Large refactors** that duplicate upstream direction — prefer contributing upstream or keeping patches minimal.

## If upstream touched the same files

1. Inspect the conflict: `git diff --merge`
2. Keep upstream behavior except where your patch must override it.
3. Re-run targeted tests for the touched areas.
