import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/** Pulls the icon keyword map out of its TypeScript module without a compiler. */
function parseIconKeywords(source) {
  const entries = [...source.matchAll(/^\s{2}(\w+):\s*\[([^\]]*)\]/gm)]

  return entries.map(([, name, list]) => ({
    name,
    keywords: [...list.matchAll(/'([^']*)'/g)].map((match) => match[1]),
  }))
}

function flattenTokens(node, pathParts, out) {
  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...pathParts, key]

    if (typeof value === 'string') {
      out.push({ path: nextPath.join('.'), value })
    } else {
      flattenTokens(value, nextPath, out)
    }
  }

  return out
}

function resolveTokenValue(value, primitives) {
  const match = /^\{(.+)\}$/.exec(value)

  if (!match) {
    return value
  }

  return primitives.find((token) => `primitive.${token.path}` === match[1])?.value ?? value
}

/**
 * Loads everything the server can answer questions about. Components come from
 * the generated manifest; icons and tokens are read from source so they cannot
 * fall behind a build step.
 */
export async function loadIndex() {
  const manifest = JSON.parse(
    await readFile(path.join(rootDir, 'docs/component-manifest.json'), 'utf8'),
  )

  const iconKeywords = parseIconKeywords(
    await readFile(path.join(rootDir, 'src/icons/icon-keywords.ts'), 'utf8'),
  )

  const colorTokens = JSON.parse(
    await readFile(path.join(rootDir, 'src/tokens/color-tokens.json'), 'utf8'),
  )

  const primitives = flattenTokens(colorTokens.primitive, [], [])
  const semantics = flattenTokens(colorTokens.semantic, [], [])

  return {
    components: manifest.components,
    icons: iconKeywords.map((icon) => ({
      name: icon.name,
      keywords: icon.keywords,
      import: 'src/icons',
    })),
    tokens: [
      ...primitives.map((token) => ({
        kind: 'primitive',
        name: `primitive.${token.path}`,
        cssVariable: `--color-primitive-${token.path.replaceAll('.', '-')}`,
        value: token.value,
      })),
      ...semantics.map((token) => ({
        kind: 'semantic',
        name: token.path,
        cssVariable: `--color-${token.path.replaceAll('.', '-')}`,
        tailwind: `${token.path.split('.')[0]}-${token.path.split('.').slice(1).join('-')}`,
        references: token.value.replace(/^\{(.+)\}$/, '$1'),
        value: resolveTokenValue(token.value, primitives),
      })),
    ],
  }
}
