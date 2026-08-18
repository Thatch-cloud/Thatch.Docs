// Renders api/public.openapi.json into the endpoint reference under
// src/api/reference/, so the published reference cannot drift from the contract
// the control plane actually serves.
//
// The generated pages are committed rather than built on the fly: a reader
// following a deep link out of a support ticket should get the same page whether
// or not the last build had access to the spec. `--check` regenerates into memory
// and fails if the committed output no longer matches, which is what CI runs.

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const SPEC = path.join(root, 'api', 'public.openapi.json')
const OUT_DIR = path.join(root, 'src', 'api', 'reference')
const METHODS = ['get', 'put', 'post', 'delete', 'patch', 'head', 'options']
const check = process.argv.includes('--check')

if (!existsSync(SPEC)) {
  // No contract vendored yet. In --check that is only consistent if there is no
  // generated reference either; pages without a contract behind them are stale
  // and must fail, or the check quietly stops meaning anything.
  const orphans = existsSync(OUT_DIR) ? await readdir(OUT_DIR) : []
  if (check && orphans.length === 0) {
    console.log('generate-api-reference: no contract vendored yet, and no reference pages — consistent')
    process.exit(0)
  }
  console.error(
    `generate-api-reference: ${path.relative(root, SPEC)} is missing${
      orphans.length ? `, but ${orphans.length} generated page(s) still exist` : ''
    }.
  Produce it with scripts/filter-openapi.mjs from a checkout of the control
  plane, then commit it. See "Endpoint reference" in the README.`,
  )
  process.exit(1)
}

const spec = JSON.parse(await readFile(SPEC, 'utf8'))

const resolveRef = (ref) =>
  ref
    .slice(2)
    .split('/')
    .reduce((acc, p) => acc?.[p.replace(/~1/g, '/').replace(/~0/g, '~')], spec)

const deref = (node) => {
  let hops = 0
  while (node && node.$ref && hops++ < 32) node = resolveRef(node.$ref)
  return node
}

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim()

// A JSON Schema rendered in full is unreadable. One level of properties, with
// type and whether it is required, is what an integrator needs; the rest stays
// in the contract itself.
function renderSchema(schema, heading) {
  schema = deref(schema)
  if (!schema) return []
  if (schema.type === 'array' && schema.items) {
    return [`${heading} — an array of:`, '', ...renderSchema(schema.items, '**Item fields**')]
  }
  const props = schema.properties ?? {}
  const names = Object.keys(props)
  if (!names.length) {
    return schema.type ? [`${heading} — \`${schema.type}\``, ''] : []
  }
  const required = new Set(schema.required ?? [])
  const lines = [heading, '', '| Field | Type | Required | Description |', '| --- | --- | --- | --- |']
  for (const name of names) {
    const p = deref(props[name]) ?? {}
    const type = p.type ?? (p.oneOf || p.anyOf ? 'one of' : p.enum ? 'enum' : 'object')
    const desc =
      p.description ?? (p.enum ? `One of: ${p.enum.map((e) => `\`${e}\``).join(', ')}` : '')
    lines.push(`| \`${name}\` | ${esc(type)} | ${required.has(name) ? 'yes' : 'no'} | ${esc(desc)} |`)
  }
  lines.push('')
  return lines
}

function renderOperation(route, method, op) {
  const lines = [`## \`${method.toUpperCase()} ${route}\``, '']
  if (op.summary) lines.push(op.summary, '')
  if (op.description && op.description !== op.summary) lines.push(op.description, '')

  const security = op.security ?? spec.security
  if (security && security.length) {
    const described = security
      .flatMap((r) => Object.keys(r))
      .map((n) => spec.components?.securitySchemes?.[n]?.description ?? n)
      .join('; ')
    lines.push(`**Authentication:** ${esc(described)}`, '')
  }

  const params = (op.parameters ?? []).map(deref)
  if (params.length) {
    lines.push('### Parameters', '')
    lines.push('| Name | In | Type | Required | Description |')
    lines.push('| --- | --- | --- | --- | --- |')
    for (const p of params) {
      const type = deref(p.schema)?.type ?? ''
      lines.push(
        `| \`${p.name}\` | ${p.in} | ${esc(type)} | ${p.required ? 'yes' : 'no'} | ${esc(p.description)} |`,
      )
    }
    lines.push('')
  }

  const body = deref(op.requestBody)
  if (body) {
    const entry = Object.entries(body.content ?? {})[0]
    if (entry) {
      const [mediaType, media] = entry
      lines.push('### Request body', '', `\`${mediaType}\`${body.required ? ' — required' : ''}`, '')
      lines.push(...renderSchema(media.schema, '**Fields**'))
    }
  }

  const responses = Object.entries(op.responses ?? {})
  if (responses.length) {
    lines.push('### Responses', '', '| Status | Description |', '| --- | --- |')
    for (const [status, response] of responses) {
      lines.push(`| \`${status}\` | ${esc(deref(response)?.description)} |`)
    }
    lines.push('')
  }
  return lines
}

// Group by tag when the spec is tagged, otherwise by the segment after the
// version prefix, so /v1/chat/completions and its siblings share a page.
function groupOf(route, op) {
  if (op.tags && op.tags.length) return op.tags[0]
  const segments = route.split('/').filter(Boolean)
  return /^v\d+$/.test(segments[0] ?? '') ? segments[1] ?? 'general' : segments[0] ?? 'general'
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const titleCase = (s) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const groups = new Map()
for (const [route, item] of Object.entries(spec.paths ?? {})) {
  for (const method of METHODS) {
    const op = item[method]
    if (!op) continue
    const merged = { ...op, parameters: [...(item.parameters ?? []), ...(op.parameters ?? [])] }
    const name = groupOf(route, op)
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name).push({ route, method, op: merged })
  }
}

const banner = [
  '<!-- Generated by scripts/generate-api-reference.mjs from api/public.openapi.json.',
  '     Do not edit by hand — CI regenerates this and fails on a diff. To change it,',
  '     change the control plane contract, re-run scripts/filter-openapi.mjs, and',
  '     regenerate with `npm run api:reference`. -->',
  '',
]

const files = new Map()
for (const [name, operations] of [...groups].sort((a, b) => a[0].localeCompare(b[0]))) {
  const lines = [...banner, `# ${titleCase(name)}`, '']
  operations.sort((a, b) => a.route.localeCompare(b.route) || a.method.localeCompare(b.method))
  for (const { route, method, op } of operations) lines.push(...renderOperation(route, method, op))
  files.set(path.join(OUT_DIR, `${slug(name)}.md`), lines.join('\n').replace(/\n{3,}/g, '\n\n'))
}

if (check) {
  const existing = existsSync(OUT_DIR)
    ? (await readdir(OUT_DIR)).map((f) => path.join(OUT_DIR, f))
    : []
  const problems = []
  for (const stale of existing) {
    if (!files.has(stale)) problems.push(`stale, no longer in the contract: ${path.relative(root, stale)}`)
  }
  for (const [file, content] of files) {
    const current = existsSync(file) ? await readFile(file, 'utf8') : null
    if (current !== content) {
      problems.push(`${current === null ? 'missing' : 'out of date'}: ${path.relative(root, file)}`)
    }
  }
  if (problems.length) {
    console.error('generate-api-reference: the committed reference does not match the contract\n')
    for (const p of problems) console.error(`  ${p}`)
    console.error('\nRun `npm run api:reference` and commit the result.')
    process.exit(1)
  }
  console.log(`generate-api-reference: ${files.size} page(s) up to date`)
} else {
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })
  for (const [file, content] of files) await writeFile(file, content)
  console.log(`generate-api-reference: wrote ${files.size} page(s) -> ${path.relative(root, OUT_DIR)}`)
  console.log('  new pages still need listing in src/SUMMARY.md')
}
