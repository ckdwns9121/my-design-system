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

const lines = [
  '/* This file is generated from src/tokens/color-tokens.json. Do not edit by hand. */',
  '@theme {',
  '  /* Primitive color tokens */',
  ...primitiveLeaves.map(([name, value]) => `  ${name}: ${value};`),
  '',
  '  /* Semantic color tokens */',
  ...semanticLeaves.map(([name, value]) => `  ${name}: ${value};`),
  '}',
  '',
]

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${lines.join('\n')}\n`)
