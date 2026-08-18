// Verifies every internal link in the built book points at a page that exists.
//
// mdBook only validates SUMMARY.md. A cross-reference to a page that was renamed
// or never written renders as a normal link and 404s in production, which is
// exactly the failure a support site cannot afford. Run after `mdbook build`.

import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const bookDir = path.join(root, 'book')

if (!existsSync(bookDir)) {
  console.error('check-links: no book/ directory — run `mdbook build` first.')
  process.exit(1)
}

async function htmlFiles(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)))
    else if (entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

const EXTERNAL = /^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i

// Resolve a link the way a static host would: a bare directory serves its
// index.html, and an extensionless path is not a thing mdBook emits.
function targetsFor(filePath, href) {
  const clean = decodeURIComponent(href.split('#')[0].split('?')[0])
  if (!clean) return []
  const base = clean.startsWith('/') ? bookDir : path.dirname(filePath)
  const resolved = path.resolve(base, clean.replace(/^\//, ''))
  return clean.endsWith('/') ? [path.join(resolved, 'index.html')] : [resolved]
}

const files = await htmlFiles(bookDir)
const broken = []

for (const file of files) {
  const html = await readFile(file, 'utf8')
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1]
    if (EXTERNAL.test(href)) continue
    const targets = targetsFor(file, href)
    if (targets.length && !targets.some((t) => existsSync(t))) {
      broken.push({ page: path.relative(bookDir, file), href })
    }
  }
}

if (broken.length) {
  console.error(`check-links: ${broken.length} broken internal link(s)\n`)
  for (const { page, href } of broken) console.error(`  ${page} -> ${href}`)
  process.exit(1)
}

console.log(`check-links: ${files.length} pages, no broken internal links`)
