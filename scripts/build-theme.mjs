// Builds theme/ from the Thatch design system.
//
// The design system ships plain CSS, but its token files @import bare package
// specifiers (`@fontsource-variable/work-sans/index.css`). A browser cannot
// resolve those, and mdBook copies `additional-css` verbatim, so the CSS has to
// be bundled first — that is all this script does.
//
// The package is private (GitHub Packages, restricted). Anyone can still build
// these docs: without it, we emit the fallback palette in styles/fallback.css
// and warn. The site renders correctly, just not in brand colours.

import { createRequire } from 'node:module'
import { cp, mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const require = createRequire(import.meta.url)

const OUT_CSS = path.join(root, 'generated', 'thatch.css')
const OUT_FONTS = path.join(root, 'src', 'thatch-fonts')
const OUT_FAVICON = path.join(root, 'theme', 'favicon.svg')
const ENTRY = path.join(root, 'styles', 'entry.generated.css')

const generated = [
  path.join(root, 'generated'),
  OUT_FONTS,
  OUT_FAVICON,
  ENTRY,
]

async function clean() {
  await Promise.all(generated.map((p) => rm(p, { recursive: true, force: true })))
}

function resolveDesignSystem() {
  try {
    require.resolve('@thatch-cloud/design-system/package.json')
    return true
  } catch {
    return false
  }
}

async function main() {
  await clean()
  if (process.argv.includes('--clean')) return

  const branded = resolveDesignSystem()

  // CI passes --require-brand: a registry auth failure must fail the build
  // rather than quietly publishing the site in fallback colours.
  if (!branded && process.argv.includes('--require-brand')) {
    console.error(
      `theme: @thatch-cloud/design-system is not installed, and --require-brand was set.
       It is an optional dependency, so npm install will not have failed on it.
       Check that the job grants permissions: packages: read, that setup-node was given
       registry-url https://npm.pkg.github.com with scope @thatch-cloud, and that this
       repository still has read access to the package.`,
    )
    process.exitCode = 1
    return
  }

  // Import order is load-bearing: fonts declare the @font-face rules, brand
  // defines the ramps, semantic maps them onto roles and must come last.
  const entry = branded
    ? [
        '@import "@thatch-cloud/design-system/tokens/fonts.css";',
        '@import "@thatch-cloud/design-system/tokens/brand.thatch.css";',
        '@import "@thatch-cloud/design-system/tokens/semantic.css";',
        '@import "./mdbook.css";',
      ]
    : ['@import "./fallback.css";', '@import "./mdbook.css";']

  await writeFile(ENTRY, entry.join('\n') + '\n')

  await esbuild.build({
    entryPoints: [ENTRY],
    bundle: true,
    outfile: OUT_CSS,
    // mdBook publishes additional-css at book/generated/thatch-<hash>.css and
    // static files from src/ verbatim, so the fonts land at book/thatch-fonts/.
    // One level up, and relative, so the site works under any base path.
    // Not src/fonts: mdBook writes its own fonts/ directory there.
    assetNames: '[name]-[hash]',
    publicPath: '../thatch-fonts',
    loader: { '.woff2': 'file', '.woff': 'file', '.ttf': 'file' },
    minify: true,
    logLevel: 'warning',
  })

  // esbuild emits the font files next to the CSS; mdBook only publishes static
  // files that live under src/, so move them there.
  await mkdir(OUT_FONTS, { recursive: true })
  let fontCount = 0
  for (const name of await readdir(path.join(root, 'generated'))) {
    if (!/[.](woff2?|ttf)$/.test(name)) continue
    await rename(path.join(root, 'generated', name), path.join(OUT_FONTS, name))
    fontCount += 1
  }

  if (branded) {
    await mkdir(path.dirname(OUT_FAVICON), { recursive: true })
    await cp(require.resolve('@thatch-cloud/design-system/assets/thatch-logo.svg'), OUT_FAVICON)
  }

  await rm(ENTRY, { force: true })

  if (branded) {
    console.log(`theme: built from @thatch-cloud/design-system (${fontCount} font files)`)
  } else {
    console.warn(
      'theme: @thatch-cloud/design-system not installed — built with the fallback palette.\n' +
        '       Brand colours and typefaces will be wrong. Authenticate to GitHub Packages\n' +
        '       and re-run `npm install` to build the real theme.',
    )
  }
}

await main()
