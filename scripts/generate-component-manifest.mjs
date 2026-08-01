import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Serializes every `*.doc.ts` into one manifest an agent can read in a single
 * call, so the rules that drive the Storybook pages are also available without
 * rendering them.
 *
 * The docs are plain object literals with no imports to evaluate, so they are
 * parsed rather than executed. That keeps the script free of a TypeScript
 * runtime, at the cost of only supporting the literal shapes ComponentDoc
 * allows; anything computed will fail loudly below.
 */
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = path.join(rootDir, 'src/components')
const outputPath = path.join(rootDir, 'docs/component-manifest.json')

async function findDocFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return findDocFiles(entryPath)
      }

      return entry.name.endsWith('.doc.ts') ? [entryPath] : []
    }),
  )

  return files.flat()
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1')
}

/** Turns the object literal after `export const doc: ComponentDoc =` into JSON. */
function parseDoc(source, file) {
  const start = source.indexOf('{', source.indexOf('export const doc'))

  if (start < 0) {
    throw new Error(`${file}: no "export const doc" object literal`)
  }

  let depth = 0
  let end = -1

  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    if (source[index] === '}') {
      depth -= 1

      if (depth === 0) {
        end = index + 1
        break
      }
    }
  }

  const literal = source
    .slice(start, end)
    // 'single quoted' -> "double quoted", unescaping the inner apostrophes
    .replace(/'((?:[^'\\]|\\.)*)'/g, (_match, inner) =>
      JSON.stringify(inner.replace(/\\'/g, "'")),
    )
    // bare keys -> quoted keys
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
    // trailing commas
    .replace(/,(\s*[}\]])/g, '$1')

  try {
    return JSON.parse(literal)
  } catch (error) {
    throw new Error(`${file}: doc is not a plain literal (${error.message})`)
  }
}

const docFiles = (await findDocFiles(componentsDir)).sort()
const components = []

for (const file of docFiles) {
  const source = stripComments(await readFile(file, 'utf8'))
  const doc = parseDoc(source, path.relative(rootDir, file))

  components.push({
    ...doc,
    source: path.relative(rootDir, path.dirname(file)),
    docs: `Components/${doc.name}`,
  })
}

components.sort((a, b) => a.name.localeCompare(b.name))

const categories = [...new Set(components.map((component) => component.category))].sort()

const manifest = {
  $schema: './component-manifest.schema.json',
  name: 'headless-core-design-system',
  generatedFrom: 'src/components/**/*.doc.ts',
  counts: {
    components: components.length,
    headless: components.filter((component) => component.headless).length,
  },
  categories,
  components,
}

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(
  `component-manifest.json: ${components.length} components across ${categories.length} categories`,
)
