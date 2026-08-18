// Filters a control-plane OpenAPI document down to the operations that are safe
// to publish, and vendors the result at api/public.openapi.json.
//
// This repository is public and the control plane's is not. Rendering a filtered
// view at build time would not be enough — vendoring the full document here
// publishes every operation in it regardless of what the site renders. So the
// filter runs where the private artifact is, and only its output is committed.
//
// It is fail-closed: an operation that appears in neither list in
// api/public-surface.json stops the build. A new endpoint added upstream cannot
// reach the public site because nobody remembered to classify it.
//
//   node scripts/filter-openapi.mjs <path-to-full-spec.json>

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

const source = process.argv[2]
if (!source) {
  console.error('usage: node scripts/filter-openapi.mjs <path-to-full-spec.json>')
  process.exit(1)
}

const spec = JSON.parse(await readFile(source, 'utf8'))
const surface = JSON.parse(await readFile(path.join(root, 'api', 'public-surface.json'), 'utf8'))
const publicIds = new Set(surface.public)
const internalIds = new Set(surface.internal)

// 1. Classify every operation, and refuse to proceed on any we do not know about.
const unclassified = []
const kept = {}
for (const [route, item] of Object.entries(spec.paths ?? {})) {
  for (const method of METHODS) {
    const op = item[method]
    if (!op) continue
    const id = op.operationId ?? `${method.toUpperCase()} ${route}`
    if (internalIds.has(id)) continue
    if (!publicIds.has(id)) {
      unclassified.push({ id, route, method: method.toUpperCase() })
      continue
    }
    kept[route] ??= {}
    kept[route][method] = op
    for (const shared of ['parameters', 'summary', 'description', 'servers']) {
      if (item[shared] !== undefined) kept[route][shared] ??= item[shared]
    }
  }
}

if (unclassified.length) {
  console.error(
    `filter-openapi: ${unclassified.length} operation(s) are in neither the public nor the`,
  )
  console.error('internal list in api/public-surface.json. Classify each one before publishing:\n')
  for (const o of unclassified) console.error(`  ${o.id}  (${o.method} ${o.route})`)
  console.error('\nIf in doubt it is internal. This site is public.')
  process.exit(1)
}

// 2. Keep only the components the surviving operations actually reach.
const wanted = new Set()
function collect(node) {
  if (Array.isArray(node)) return node.forEach(collect)
  if (!node || typeof node !== 'object') return
  for (const [key, value] of Object.entries(node)) {
    if (key === '$ref' && typeof value === 'string' && value.startsWith('#/components/')) {
      if (!wanted.has(value)) {
        wanted.add(value)
        collect(resolve(value))
      }
    } else collect(value)
  }
}
function resolve(ref) {
  return ref
    .slice(2)
    .split('/')
    .reduce((acc, part) => acc?.[part.replace(/~1/g, '/').replace(/~0/g, '~')], spec)
}

collect(kept)

const components = {}
for (const ref of wanted) {
  const [, , group, name] = ref.split('/')
  components[group] ??= {}
  components[group][name] = resolve(ref)
}
// Security schemes are referenced by name, not by $ref, so they need collecting
// separately or the published document describes auth it never defines.
const usedSchemes = new Set()
for (const item of Object.values(kept)) {
  for (const method of METHODS) {
    for (const requirement of item[method]?.security ?? spec.security ?? []) {
      Object.keys(requirement).forEach((s) => usedSchemes.add(s))
    }
  }
}
if (usedSchemes.size) {
  components.securitySchemes ??= {}
  for (const name of usedSchemes) {
    const scheme = spec.components?.securitySchemes?.[name]
    if (scheme) components.securitySchemes[name] = scheme
  }
}

const out = {
  openapi: spec.openapi,
  info: spec.info,
  servers: surface.servers ?? spec.servers,
  paths: kept,
  ...(Object.keys(components).length ? { components } : {}),
  ...(spec.security ? { security: spec.security } : {}),
}

const target = path.join(root, 'api', 'public.openapi.json')
await writeFile(target, JSON.stringify(out, null, 2) + '\n')
const opCount = Object.values(kept).reduce(
  (n, item) => n + METHODS.filter((m) => item[m]).length,
  0,
)
console.log(
  `filter-openapi: ${opCount} public operation(s), ${internalIds.size} withheld -> api/public.openapi.json`,
)
