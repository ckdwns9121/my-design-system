import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(rootDir, 'src/tokens/color-tokens.json')
const outputPath = path.join(rootDir, 'src/tokens/generated/colors.css')

const tokens = JSON.parse(await readFile(sourcePath, 'utf8'))

function kebab(value) {
  return value.replaceAll('.', '-')
}

function cssName(pathParts, kind) {
  if (kind === 'semantic') {
    return `--color-${pathParts.slice(1).join('-')}`
  }

  return `--color-${pathParts.join('-')}`
}

function referenceToCssValue(value) {
  const match = /^\{(.+)\}$/.exec(value)

  if (!match) {
    return value
  }

  return `var(--color-${kebab(match[1])})`
}

function collectLeaves(node, pathParts, kind, leaves = []) {
  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...pathParts, key]

    if (typeof value === 'string') {
      leaves.push([cssName(nextPath, kind), referenceToCssValue(value)])
    } else {
      collectLeaves(value, nextPath, kind, leaves)
    }
  }

  return leaves
}

const primitiveLeaves = collectLeaves(tokens.primitive, ['primitive'], 'primitive')
const semanticLeaves = collectLeaves(tokens.semantic, ['semantic'], 'semantic')
const darkLeaves = collectLeaves(tokens.semanticDark ?? {}, ['semantic'], 'semantic')

const lines = [
  '/* This file is generated from src/tokens/color-tokens.json. Do not edit by hand. */',
  '/* `static` keeps every token as a CSS variable so docs and inline styles can read',
  '   var(--color-*) even when no utility class references the token. */',
  '@theme static {',
  '  /* Primitive color tokens */',
  ...primitiveLeaves.map(([name, value]) => `  ${name}: ${value};`),
  '',
  '  /* Semantic color tokens */',
  ...semanticLeaves.map(([name, value]) => `  ${name}: ${value};`),
  '}',
  '',
  /* Dark mode remaps the same semantic names, so components never branch on
     theme; only the value behind the alias changes.

     Light is emitted as its own block even though `@theme` already puts those
     values on `:root`. Variables inherit, so once a dark ancestor sets them the
     values flow into every descendant. A nested light scope needs a rule of its
     own to put the light values back. */
  ...(darkLeaves.length > 0
    ? [
        '/* Themes. ThemeProvider sets data-theme on the document element, or on a',
        '   scoped element when one is passed. */',
        "[data-theme='light'] {",
        ...semanticLeaves.map(([name, value]) => `  ${name}: ${value};`),
        '}',
        '',
        "[data-theme='dark'] {",
        ...darkLeaves.map(([name, value]) => `  ${name}: ${value};`),
        '}',
        '',
      ]
    : []),
]

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${lines.join('\n')}\n`)
