# Thatch.Docs

Public-facing documentation for **Thatch** — the API, SDKs, accounts and billing, and
support material. Built with [mdBook](https://rust-lang.github.io/mdBook/) and published
to <https://docs.thatch.cloud> from `main`.

This repository is public. Assume everything committed here is read by customers.

## Local development

Prerequisites: **Node 20+** and **mdBook 0.5.4** (the version CI pins — keep them in
step, see `MDBOOK_VERSION` in the workflows).

```bash
cargo install mdbook --locked
```

Then:

```bash
npm install
npm run serve
```

`npm run serve` builds the theme and opens the book with live reload. `npm run build`
does a one-shot build into `book/`.

### Design system access

The theme is generated from **`@thatch-cloud/design-system`**, a private package on
GitHub Packages. `.npmrc` already points the `@thatch-cloud` scope at the right
registry; you supply the token.

```bash
gh auth refresh -s read:packages          # add the scope to your gh token
npm config set //npm.pkg.github.com/:_authToken "$(gh auth token)"
npm install
```

Without that token the package is skipped — it is an `optionalDependency`, so
`npm install` still succeeds — and the build substitutes `styles/fallback.css`. The site
renders and reads correctly, in deliberately-not-Thatch colours, with a warning on
stdout. That is what lets an outside contributor fix a typo without needing access to
anything private. **CI enforces the real theme on deploy** (`npm run theme:ci`), so an
unbranded build can never reach production.

## Layout

```
src/                 the book — markdown, plus SUMMARY.md (the table of contents)
src/CNAME            custom domain, published verbatim to the site root
styles/mdbook.css    maps Thatch semantic tokens onto mdBook's chrome variables
styles/fallback.css  stand-in tokens for builds without design system access
theme/head.hbs       bridges mdBook's theme class to the design system's data-theme
scripts/             theme build and link check
generated/           build output (git-ignored)
```

### Adding a page

1. Create the markdown file under `src/`.
2. Add it to `src/SUMMARY.md` — the build has `create-missing = false`, so a page that
   is not listed there is not published, and a listed page that does not exist fails
   the build.
3. Cross-link with **relative `.md` paths** (`../api/errors.md`); mdBook rewrites them
   to `.html` and `scripts/check-links.mjs` verifies they resolve.

### Styling

Read semantic tokens only — `var(--color-accent)`, never `var(--brand-accent-500)` and
never a hex. That is the design system's one rule, and it is what keeps a rebrand to a
version bump. New chrome rules go in `styles/mdbook.css`; if a token you need is
missing, add it to the design system rather than hard-coding it here.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` builds the theme, builds the book, and
publishes to GitHub Pages. Pull requests get a build check
(`.github/workflows/ci.yml`) that does not require design system access.

## Known wrinkles

- **`package-lock.json` has no entry for `@thatch-cloud/design-system`** — it was
  generated without registry access, so npm could only record a placeholder, which was
  removed rather than committed (a placeholder would let `npm ci` skip the package
  silently). That is why CI runs `npm install`, which resolves it fresh against the
  Actions token. Run `npm install` once from an authenticated machine, commit the
  resulting lockfile, and CI can move to `npm ci`.
- **The favicon is the design system's `thatch-logo.svg`.** If that asset is a wordmark
  rather than a mark, it will be illegible at 16px and should be replaced with a
  square glyph — override it by committing `theme/favicon.svg` and dropping the copy
  step in `scripts/build-theme.mjs`.
