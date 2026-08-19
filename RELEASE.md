# Release Process

How to cut and publish a new release of **@pyrologic/pyrologjs**.

The guiding rule: **`main` always mirrors exactly what is published to npm.** There
is never a moment where `main` carries an `[Unreleased]` changelog section that has
actually shipped. To achieve this, the changelog is *finalized on `dev` as the
release-prep commit*, before the PR to `main`.

## 1. Cut the release (on `dev`)

Land the following as a single "cut release X.Y.Z" commit on `dev`:

1. **CHANGELOG.md** — rename `## [Unreleased]` to `## [X.Y.Z] - <YYYY-MM-DD>` using
   the intended publish date, then add a fresh empty `## [Unreleased]` section above it.
2. **CHANGELOG.md links** — at the bottom, point `[Unreleased]` at
   `...compare/vX.Y.Z...HEAD` and add a new `[X.Y.Z]` compare line.
3. **package.json** — bump `"version"` to `X.Y.Z`.

Follow [Semantic Versioning](https://semver.org/). Note: this package is consumed
only by internal projects, so a breaking change may be released as a minor bump when
upgrade timing is coordinated (record the rationale in the changelog `### Notes`). If
the package is ever published for external consumers, breaking changes must resume
warranting a major bump.

The library version is burned into the build automatically from `package.json` via a
generated `src/version.ts` (git-ignored) and is exposed at runtime through
`PyroLog.getInstance().version` — no manual step needed.

## 2. Promote to `main`

4. Open a PR `dev` → `main` and merge it. Because the changelog was finalized in
   step 1, `main` now reflects the published state.

## 3. Tag, release, publish

5. **Tag** the merge commit on `main`: `git tag vX.Y.Z && git push origin vX.Y.Z`.
6. **GitHub release** — create a release for `vX.Y.Z` and paste the `[X.Y.Z]`
   CHANGELOG section body as the release notes (the changelog is the single source of
   truth; do not hand-write notes that can drift).
7. **Publish** — `npm publish`. The `prepublishOnly` script rebuilds `dist/` first, so
   a stale or missing bundle can never be published. `dist/` is git-ignored and only
   the files listed in `package.json` `"files"` are shipped.

## Checklist

- [ ] `dev`: CHANGELOG `[Unreleased]` promoted to `[X.Y.Z] - <date>`, new empty `[Unreleased]` added
- [ ] `dev`: CHANGELOG compare links updated
- [ ] `dev`: `package.json` version bumped to `X.Y.Z`
- [ ] PR `dev` → `main` merged
- [ ] Tag `vX.Y.Z` pushed on `main`
- [ ] GitHub release created with CHANGELOG section as notes
- [ ] `npm publish` run (rebuilds via `prepublishOnly`)
